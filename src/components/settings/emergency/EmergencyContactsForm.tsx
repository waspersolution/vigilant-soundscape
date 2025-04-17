
import { Button } from "@/components/ui/button";
import { EmergencyContact } from "@/types";
import { Plus, Save, AlertTriangle } from "lucide-react";
import EmergencyContactList from "./EmergencyContactList";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmergencyContactsFormProps {
  editedContacts: EmergencyContact[];
  updateContact: (index: number, field: keyof EmergencyContact, value: string | number) => void;
  removeContact: (index: number) => void;
  addContact: () => void;
  saveContacts: () => void;
  cancelEditing: () => void;
  isPending: boolean;
}

export default function EmergencyContactsForm({
  editedContacts,
  updateContact,
  removeContact,
  addContact,
  saveContacts,
  cancelEditing,
  isPending
}: EmergencyContactsFormProps) {
  return (
    <div className="space-y-4">
      {editedContacts.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-2">No contacts added yet.</p>
        </div>
      )}
      
      <EmergencyContactList
        contacts={editedContacts}
        isEditing={true}
        updateContact={updateContact}
        removeContact={removeContact}
      />
      
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
          <Button variant="outline" onClick={cancelEditing}>
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={saveContacts} 
            disabled={isPending}
            className="flex items-center gap-1"
          >
            <Save size={16} /> Save Contacts
          </Button>
        </div>
      </div>
    </div>
  );
}
