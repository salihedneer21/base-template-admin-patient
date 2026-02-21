import { Navigate, Outlet } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import FullPageSpinner from "@/components/ui/FullPageSpinner";
import { useAuthHydration } from "@/lib/auth-hydration";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function GuestRoute() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const showLoader = useAuthHydration(isAuthLoading);

  if (showLoader) {
    return <FullPageSpinner />;
  }

  if (isAuthenticated) {
    // If user doesn't exist yet, redirect to role selection
    if (user === null) {
      return <Navigate to="/select-role" replace />;
    }

    // Still loading user
    if (user === undefined && isUserLoading) {
      return <FullPageSpinner />;
    }

    // Redirect based on role
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/patient" replace />;
  }

  return <Outlet />;
}
