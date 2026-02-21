import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

export default function AccountInactive() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <UserX className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-semibold mb-2">
          Account Inactive
        </h1>
        <p className="text-muted-foreground mb-6">
          Your account has been deactivated. Please contact an administrator to
          reactivate your account.
        </p>

        <Button onClick={handleSignOut} variant="outline" className="w-full">
          Sign out
        </Button>
      </div>
    </div>
  );
}
