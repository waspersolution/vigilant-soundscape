
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { EmergencyContact } from "@/types";
import { fetchEmergencyContacts, updateEmergencyContacts } from "@/services/communicationService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EmergencyContactsHeader from "./emergency/EmergencyContactsHeader";
import EmergencyContactList from "./emergency/EmergencyContactList";
import EmergencyContactsForm from "./emergency/EmergencyContactsForm";

export default function EmergencyContactsSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: contacts = [] } = useQuery({
    queryKey: ["emergencyContacts", user?.communityId],
    queryFn: () => fetchEmergencyContacts(user?.communityId || ""),
    enabled: !!user?.communityId,
  });
  
  const [editedContacts, setEditedContacts] = useState<EmergencyContact[]>(contacts);
  
  useEffect(() => {
    setEditedContacts(contacts);
  }, [contacts]);
  
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
      <EmergencyContactsHeader 
        isLeaderOrAdmin={isLeaderOrAdmin} 
        isEditing={isEditing} 
        onEdit={() => setIsEditing(true)} 
      />
      
      {contacts.length === 0 && !isEditing ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No emergency contacts have been set up yet.</p>
          {isLeaderOrAdmin && (
            <Button variant="default" onClick={() => setIsEditing(true)}>
              Add Emergency Contacts
            </Button>
          )}
        </div>
      ) : isEditing ? (
        <EmergencyContactsForm
          editedContacts={editedContacts}
          updateContact={updateContact}
          removeContact={removeContact}
          addContact={addContact}
          saveContacts={saveContacts}
          cancelEditing={() => setIsEditing(false)}
          isPending={updateMutation.isPending}
        />
      ) : (
        <EmergencyContactList
          contacts={contacts}
          isEditing={false}
          updateContact={updateContact}
          removeContact={removeContact}
        />
      )}
      
      {!isEditing && (
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Emergency alerts are limited to 3 per day and 10 per month to prevent abuse.</p>
        </div>
      )}
    </div>
  );
}
