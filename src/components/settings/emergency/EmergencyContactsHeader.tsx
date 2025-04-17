
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface EmergencyContactsHeaderProps {
  isLeaderOrAdmin: boolean;
  isEditing: boolean;
  onEdit: () => void;
}

export default function EmergencyContactsHeader({
  isLeaderOrAdmin,
  isEditing,
  onEdit
}: EmergencyContactsHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Emergency Contacts</h3>
        {isLeaderOrAdmin && !isEditing && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
        )}
      </div>
      <Separator />
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Emergency Contact Information</AlertTitle>
        <AlertDescription>
          Add up to 3 trusted contacts who will be notified via SMS when you trigger a panic alert.
          They will receive your name, location, and timestamp of the alert.
        </AlertDescription>
      </Alert>
    </>
  );
}
