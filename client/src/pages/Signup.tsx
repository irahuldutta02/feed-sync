import { LoginCard } from "@/components/ui-custom/LoginCard";
import { Logo } from "@/components/ui-custom/Logo";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
        </div>

        <LoginCard />
      </div>
    </div>
  );
};

export default Signup;
