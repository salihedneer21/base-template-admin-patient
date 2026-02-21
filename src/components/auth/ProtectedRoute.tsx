import { Navigate, Outlet } from "react-router-dom";
import FullPageSpinner from "@/components/ui/FullPageSpinner";
import { useConvexAuth } from "convex/react";
import { useAuthHydration } from "@/lib/auth-hydration";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function ProtectedRoute() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const showLoader = useAuthHydration(isAuthLoading || isUserLoading);

  if (showLoader) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User not yet created in our system - redirect to role selection
  if (user === null) {
    return <Navigate to="/select-role" replace />;
  }

  // Still loading user data
  if (user === undefined) {
    return <FullPageSpinner />;
  }

  // Check if user is active
  if (!user.isActive) {
    return <Navigate to="/account-inactive" replace />;
  }

  return <Outlet />;
}
