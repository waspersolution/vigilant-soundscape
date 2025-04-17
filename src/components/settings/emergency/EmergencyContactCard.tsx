
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmergencyContact } from "@/types";
import { Trash2, Phone } from "lucide-react";

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  index: number;
  isEditing: boolean;
  updateContact: (index: number, field: keyof EmergencyContact, value: string | number) => void;
  removeContact: (index: number) => void;
}

export default function EmergencyContactCard({
  contact,
  index,
  isEditing,
  updateContact,
  removeContact
}: EmergencyContactCardProps) {
  if (isEditing) {
    return (
      <Card className="p-4">
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
    );
  }
  
  return (
    <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
      <div>
        <p className="font-medium">{contact.name}</p>
        <p className="text-sm text-muted-foreground">{contact.role}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          window.open(`tel:${contact.phone}`);
        }}
        className="flex items-center gap-1"
      >
        <Phone size={16} /> {contact.phone}
      </Button>
    </div>
  );
}
