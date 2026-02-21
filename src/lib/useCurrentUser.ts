import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { authClient } from "./auth-client";

export type UserRole = "admin" | "patient";

export interface CurrentUser {
  _id: string;
  betterAuthUserId: string;
  email: string;
  name?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export function useCurrentUser() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const betterAuthUserId = session?.user?.id;

  const user = useQuery(
    api.users.getCurrentUser,
    betterAuthUserId ? { betterAuthUserId } : "skip"
  );

  const isLoading = isSessionLoading || (betterAuthUserId !== undefined && user === undefined);

  return {
    user: user as CurrentUser | null | undefined,
    isLoading,
    isAuthenticated: !!session?.user,
    session,
  };
}

export function useIsAdmin() {
  const { user, isLoading } = useCurrentUser();
  return {
    isAdmin: user?.role === "admin",
    isLoading,
  };
}

export function useIsPatient() {
  const { user, isLoading } = useCurrentUser();
  return {
    isPatient: user?.role === "patient",
    isLoading,
  };
}
