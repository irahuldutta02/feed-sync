import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserX } from "lucide-react";

const AnonymousFeedbackToggle = ({ isAnonymous, onChange }) => {
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
