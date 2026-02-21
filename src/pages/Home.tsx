import { Link, Navigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Shield, User } from "lucide-react";
import FullPageSpinner from "@/components/ui/FullPageSpinner";

export default function Home() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const { user, isLoading: isUserLoading } = useCurrentUser();

  // Show loading while auth is initializing
  if (isAuthLoading) {
    return <FullPageSpinner />;
  }

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    if (isUserLoading || !user) {
      return <FullPageSpinner />;
    }
    // Redirect inactive users to inactive page
    if (!user.isActive) {
      return <Navigate to="/account-inactive" replace />;
    }
    return <Navigate to={user.role === "admin" ? "/admin" : "/patient"} replace />;
  }

  // Guest view
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-20 text-center">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Role-Based Admin & Patient Portal
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            A template with separate dashboards for administrators and patients.
            Register to access your patient dashboard.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 text-left max-w-3xl mx-auto">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Admin Dashboard</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Full user management capabilities. View all users, change roles,
                activate/deactivate accounts, and more.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Patient Dashboard</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Personal profile management. Update contact information, emergency
                contacts, and view account details.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
