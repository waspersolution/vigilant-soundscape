
import { EmergencyContact } from "@/types";
import EmergencyContactCard from "./EmergencyContactCard";

interface EmergencyContactListProps {
  contacts: EmergencyContact[];
  isEditing: boolean;
  updateContact: (index: number, field: keyof EmergencyContact, value: string | number) => void;
  removeContact: (index: number) => void;
}

export default function EmergencyContactList({
  contacts,
  isEditing,
  updateContact,
  removeContact
}: EmergencyContactListProps) {
  if (contacts.length === 0 && !isEditing) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No emergency contacts have been set up yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {contacts.map((contact, index) => (
        <EmergencyContactCard
          key={contact.id}
          contact={contact}
          index={index}
          isEditing={isEditing}
          updateContact={updateContact}
          removeContact={removeContact}
        />
      ))}
    </div>
  );
}
