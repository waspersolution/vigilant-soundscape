
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { ReactNode } from "react";

export interface DynamicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  trigger?: ReactNode;
  inputLabel?: string;
  inputValue?: string;
  inputId?: string;
  inputType?: string;
  inputPlaceholder?: string;
  onInputChange?: (value: string) => void;
  onSubmit: () => Promise<void>;
  submitButtonText: string;
  loadingText: string;
  loading: boolean;
  disabled?: boolean;
}

export default function DynamicDialog({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  inputLabel,
  inputValue,
  inputId = "input",
  inputType = "text",
  inputPlaceholder,
  onInputChange,
  onSubmit,
  submitButtonText,
  loadingText,
  loading,
  disabled
}: DynamicDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {inputLabel && onInputChange && (
            <div className="grid gap-2">
              <label htmlFor={inputId}>{inputLabel}</label>
              <Input
                id={inputId}
                type={inputType}
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={inputPlaceholder}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={onSubmit} 
            disabled={loading || disabled}
          >
            {loading ? loadingText : submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
