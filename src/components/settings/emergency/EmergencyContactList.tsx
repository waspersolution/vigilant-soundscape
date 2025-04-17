
import { EmergencyContact } from "@/types";
import EmergencyContactCard from "./EmergencyContactCard";

interface EmergencyContactListProps {
  contacts: EmergencyContact[];
  isEditing: boolean;
  updateContact: (index: number, field: keyof EmergencyContact, value: string | number) => void;
  removeContact: (index: number) => void;
  emptyStateMessage?: string;
  showEmptyState?: boolean;
}

export default function EmergencyContactList({
  contacts,
  isEditing,
  updateContact,
  removeContact,
  emptyStateMessage = "No emergency contacts have been set up yet.",
  showEmptyState = true
}: EmergencyContactListProps) {
  // Show empty state when there are no contacts and we're not in edit mode
  if (contacts.length === 0 && !isEditing && showEmptyState) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">{emptyStateMessage}</p>
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
