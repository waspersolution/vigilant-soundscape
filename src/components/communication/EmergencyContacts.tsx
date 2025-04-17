
import { useState, useEffect } from "react";
import { Plus, Phone, Trash2, Save, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { EmergencyContact } from "@/types";
import { fetchEmergencyContacts, updateEmergencyContacts } from "@/services/communicationService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EmergencyContacts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch emergency contacts
  const { data: contacts = [] } = useQuery({
    queryKey: ["emergencyContacts", user?.communityId],
    queryFn: () => fetchEmergencyContacts(user?.communityId || ""),
    enabled: !!user?.communityId,
  });
  
  const [editedContacts, setEditedContacts] = useState<EmergencyContact[]>(contacts);
  
  // Update local state when contacts are loaded
  useEffect(() => {
    setEditedContacts(contacts);
  }, [contacts]);
  
  // Handle saving emergency contacts
  const updateMutation = useMutation({
    mutationFn: (newContacts: EmergencyContact[]) => 
      updateEmergencyContacts(user?.communityId || "", newContacts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencyContacts"] });
      setIsEditing(false);
    },
  });
  
  const addContact = () => {
    if (editedContacts.length >= 3) {
      return; // Maximum 3 contacts allowed
    }
    
    setEditedContacts([
      ...editedContacts,
      {
        id: Date.now().toString(),
        name: "",
        phone: "",
        role: "",
        priority: editedContacts.length + 1,
      },
    ]);
  };
  
  const updateContact = (index: number, field: keyof EmergencyContact, value: string | number) => {
    const newContacts = [...editedContacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setEditedContacts(newContacts);
  };
  
  const removeContact = (index: number) => {
    setEditedContacts(editedContacts.filter((_, i) => i !== index));
  };
  
  const saveContacts = () => {
    updateMutation.mutate(editedContacts);
  };
  
  const isLeaderOrAdmin = user?.role === "community_leader" || user?.role === "admin" || user?.role === "community_manager";
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Emergency Contacts</h3>
        {isLeaderOrAdmin && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>
      <Separator />
      
      <Alert variant="info" className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Emergency Contact Information</AlertTitle>
        <AlertDescription>
          Add up to 3 trusted contacts who will be notified via SMS when you trigger a panic alert.
          They will receive your name, location, and timestamp of the alert.
        </AlertDescription>
      </Alert>
      
      {contacts.length === 0 && !isEditing ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No emergency contacts have been set up yet.</p>
          <Button variant="default" onClick={() => setIsEditing(true)}>
            Add Emergency Contacts
          </Button>
        </div>
      ) : isEditing ? (
        <div className="space-y-4">
          {editedContacts.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-2">No contacts added yet.</p>
            </div>
          )}
          
          {editedContacts.map((contact, index) => (
            <Card key={contact.id} className="p-4">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-5">
                  <Label htmlFor={`name-${index}`}>Name</Label>
                  <Input
                    id={`name-${index}`}
                    value={contact.name}
                    onChange={(e) => updateContact(index, "name", e.target.value)}
                    placeholder="Contact name"
                  />
                </div>
                <div className="col-span-12 sm:col-span-5">
                  <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                  <Input
                    id={`phone-${index}`}
                    value={contact.phone}
                    onChange={(e) => updateContact(index, "phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="col-span-10 sm:col-span-1">
                  <Label htmlFor={`role-${index}`}>Relation</Label>
                  <Input
                    id={`role-${index}`}
                    value={contact.role}
                    onChange={(e) => updateContact(index, "role", e.target.value)}
                    placeholder="Family/Friend"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeContact(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={addContact} 
              className="flex items-center gap-1"
              disabled={editedContacts.length >= 3}
            >
              <Plus size={16} /> Add Contact
              {editedContacts.length >= 3 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-1">
                        <AlertTriangle size={14} className="text-amber-500" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximum 3 contacts allowed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button 
                variant="default" 
                onClick={saveContacts} 
                disabled={updateMutation.isPending}
                className="flex items-center gap-1"
              >
                <Save size={16} /> Save Contacts
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.role}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // In a real app, this would initiate a phone call
                  window.open(`tel:${contact.phone}`);
                }}
                className="flex items-center gap-1"
              >
                <Phone size={16} /> {contact.phone}
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {!isEditing && (
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Emergency alerts are limited to 3 per day and 10 per month to prevent abuse.</p>
        </div>
      )}
    </div>
  );
}
