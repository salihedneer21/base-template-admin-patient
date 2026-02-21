import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";
import { api } from "../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Shield, User } from "lucide-react";

export default function SelectRole() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const createUser = useMutation(api.users.create);
  const [isLoading, setIsLoading] = useState<"admin" | "patient" | null>(null);

  const handleSelectRole = async (role: "admin" | "patient") => {
    if (!session?.user?.id || !session?.user?.email) {
      toast.error("Session not found. Please log in again.");
      return;
    }

    setIsLoading(role);

    try {
      await createUser({
        betterAuthUserId: session.user.id,
        email: session.user.email,
        name: session.user.name || undefined,
        role,
      });

      toast.success(`Account created as ${role === "admin" ? "Admin" : "Patient"}`);
      navigate(role === "admin" ? "/admin" : "/patient", { replace: true });
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("Failed to create account. Please try again.");
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-semibold mb-2">
            Select Your Role
          </h1>
          <p className="text-muted-foreground">
            Choose how you want to use the platform
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleSelectRole("admin")}
            disabled={isLoading !== null}
            className="w-full p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Admin</h3>
                <p className="text-sm text-muted-foreground">
                  Manage users, view all patient data, and configure system settings
                </p>
              </div>
            </div>
            {isLoading === "admin" && (
              <div className="mt-3 flex items-center justify-center">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
          </button>

          <button
            onClick={() => handleSelectRole("patient")}
            disabled={isLoading !== null}
            className="w-full p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Patient</h3>
                <p className="text-sm text-muted-foreground">
                  Access your personal dashboard, manage your profile, and view your records
                </p>
              </div>
            </div>
            {isLoading === "patient" && (
              <div className="mt-3 flex items-center justify-center">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={async () => {
              await authClient.signOut();
              navigate("/login", { replace: true });
            }}
            className="text-sm text-muted-foreground"
          >
            Sign out and use a different account
          </Button>
        </div>
      </div>
    </div>
  );
}
