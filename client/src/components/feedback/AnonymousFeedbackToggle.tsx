
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UserX } from "lucide-react";

interface AnonymousFeedbackToggleProps {
  isAnonymous: boolean;
  onChange: (value: boolean) => void;
}

const AnonymousFeedbackToggle = ({
  isAnonymous,
  onChange,
}: AnonymousFeedbackToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="anonymous-mode"
        checked={isAnonymous}
        onCheckedChange={onChange}
      />
      <Label 
        htmlFor="anonymous-mode" 
        className="flex items-center cursor-pointer"
      >
        <UserX className="h-4 w-4 mr-2 text-muted-foreground" />
        Submit anonymously
      </Label>
    </div>
  );
};

export default AnonymousFeedbackToggle;
