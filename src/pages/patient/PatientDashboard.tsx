import { useCurrentUser } from "@/lib/useCurrentUser";

export default function PatientDashboard() {
  const { user } = useCurrentUser();

  return (
    <div className="flex flex-1 flex-col bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold">Patient Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}
