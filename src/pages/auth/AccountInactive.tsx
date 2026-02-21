import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ShieldX, Mail, LogOut } from "lucide-react";

export default function AccountInactive() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Account Inactive
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-md">
          Your account has been deactivated. Please contact an administrator to
          reactivate your account.
        </p>

        <div className="mt-10 w-full max-w-sm">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Need Help?</h3>
            </div>
            <p className="text-sm text-muted-foreground text-left mb-4">
              If you believe this is a mistake or need assistance, please reach
              out to the system administrator.
            </p>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
