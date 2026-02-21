import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import toast from "react-hot-toast";
import { api } from "../../../convex/_generated/api";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, Shield, User } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

export default function AdminDashboard() {
  const { user } = useCurrentUser();
  const allUsers = useQuery(api.admin.users.listAll);
  const updateRole = useMutation(api.admin.users.updateRole);
  const toggleActive = useMutation(api.admin.users.toggleActive);
  const deleteUser = useMutation(api.admin.users.deleteUser);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const adminCount = allUsers?.filter((u) => u.role === "admin").length || 0;
  const patientCount = allUsers?.filter((u) => u.role === "patient").length || 0;
  const activeCount = allUsers?.filter((u) => u.isActive).length || 0;

  const handleToggleRole = async (userId: Id<"users">, currentRole: string) => {
    setLoadingUserId(userId);
    try {
      const newRole = currentRole === "admin" ? "patient" : "admin";
      await updateRole({ userId, role: newRole as "admin" | "patient" });
      toast.success(`User role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update role");
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleToggleActive = async (userId: Id<"users">) => {
    setLoadingUserId(userId);
    try {
      await toggleActive({ userId });
      toast.success("User status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: Id<"users">) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    setLoadingUserId(userId);
    try {
      await deleteUser({ userId });
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-semibold">{allUsers?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-semibold">{adminCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patients</p>
                <p className="text-2xl font-semibold">{patientCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-semibold">{activeCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="font-heading text-xl font-semibold">User Management</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage user roles and account status
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allUsers?.map((u) => (
                  <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                          {u.email[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{u.name || "No name"}</p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.role === "admin" ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        {u.role === "admin" ? "Admin" : "Patient"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.isActive ? (
                          <UserCheck className="w-3 h-3" />
                        ) : (
                          <UserX className="w-3 h-3" />
                        )}
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u._id !== user?._id && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleRole(u._id, u.role)}
                              disabled={loadingUserId === u._id}
                            >
                              {loadingUserId === u._id ? "..." : "Toggle Role"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleActive(u._id)}
                              disabled={loadingUserId === u._id}
                            >
                              {loadingUserId === u._id
                                ? "..."
                                : u.isActive
                                  ? "Deactivate"
                                  : "Activate"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={loadingUserId === u._id}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                        {u._id === user?._id && (
                          <span className="text-xs text-muted-foreground italic">
                            (You)
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {(!allUsers || allUsers.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
