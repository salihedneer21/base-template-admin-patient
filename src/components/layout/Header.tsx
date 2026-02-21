import { useState } from "react";
import { Link } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useCurrentUser } from "@/lib/useCurrentUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, User } from "lucide-react";

export default function Header() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useCurrentUser();
  const { data: session } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const userEmail = session?.user?.email ?? "";
  const initials = userEmail ? userEmail[0]?.toUpperCase() : "U";

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut();
    toast.success("You've been signed out");
    setIsSigningOut(false);
  };

  const dashboardPath = user?.role === "admin" ? "/admin" : "/patient";
  const dashboardLabel = user?.role === "admin" ? "Admin Dashboard" : "Dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white shadow-sm">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Specode" className="h-7 w-auto" />
        </Link>

        <nav className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-24 animate-pulse rounded-full bg-slate-100" />
              <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
            </div>
          ) : isAuthenticated ? (
            <>
              {user && (
                <Link
                  to={dashboardPath}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-foreground shadow-xs transition hover:bg-gray-200"
                >
                  {user.role === "admin" ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  {dashboardLabel}
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border shadow-xs transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-0"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold leading-none text-primary">
                      {initials}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-slate-200">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {userEmail || "Signed in"}
                  </DropdownMenuLabel>
                  {user && (
                    <DropdownMenuLabel className="text-xs font-normal">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        {user.role === "admin" ? "Admin" : "Patient"}
                      </span>
                    </DropdownMenuLabel>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={handleSignOut}
                    disabled={isSigningOut}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 data-[highlighted]:bg-red-50"
                  >
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex h-9 items-center rounded-full border border-border px-4 text-sm font-medium text-foreground shadow-xs transition hover:bg-gray-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
