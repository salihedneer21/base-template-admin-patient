import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import toast from "react-hot-toast";
import { api } from "../../../convex/_generated/api";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Calendar, Phone, MapPin, Heart } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

export default function PatientDashboard() {
  const { user } = useCurrentUser();
  const patientProfile = useQuery(
    api.patient.profiles.getByUserId,
    user?._id ? { userId: user._id as Id<"users"> } : "skip"
  );
  const createProfile = useMutation(api.patient.profiles.create);
  const updateProfile = useMutation(api.patient.profiles.update);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "" as "male" | "female" | "other" | "prefer_not_to_say" | "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  useEffect(() => {
    if (patientProfile) {
      setFormData({
        firstName: patientProfile.firstName || "",
        lastName: patientProfile.lastName || "",
        dob: patientProfile.dob || "",
        gender: patientProfile.gender || "",
        phone: patientProfile.phone || "",
        address: patientProfile.address || "",
        city: patientProfile.city || "",
        state: patientProfile.state || "",
        zip: patientProfile.zip || "",
        emergencyContactName: patientProfile.emergencyContactName || "",
        emergencyContactPhone: patientProfile.emergencyContactPhone || "",
      });
    }
  }, [patientProfile]);

  const handleSave = async () => {
    if (!user?._id) return;

    if (!formData.firstName || !formData.lastName) {
      toast.error("First name and last name are required");
      return;
    }

    setIsSaving(true);
    try {
      if (patientProfile) {
        await updateProfile({
          profileId: patientProfile._id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dob: formData.dob || undefined,
          gender: formData.gender || undefined,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          zip: formData.zip || undefined,
          emergencyContactName: formData.emergencyContactName || undefined,
          emergencyContactPhone: formData.emergencyContactPhone || undefined,
        });
        toast.success("Profile updated successfully");
      } else {
        await createProfile({
          userId: user._id as Id<"users">,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dob: formData.dob || undefined,
          gender: formData.gender || undefined,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          zip: formData.zip || undefined,
          emergencyContactName: formData.emergencyContactName || undefined,
          emergencyContactPhone: formData.emergencyContactPhone || undefined,
        });
        toast.success("Profile created successfully");
      }
      setIsEditing(false);
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const hasProfile = patientProfile !== null && patientProfile !== undefined;

  return (
    <div className="flex flex-1 flex-col bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold">Patient Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {patientProfile?.firstName || user?.name || user?.email}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profile Status</p>
                <p className="text-lg font-semibold">
                  {hasProfile ? "Complete" : "Incomplete"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-lg font-semibold">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="text-lg font-semibold">
                  {user?.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold">Your Profile</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {hasProfile
                  ? "Manage your personal information"
                  : "Complete your profile to get started"}
              </p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                {hasProfile ? "Edit Profile" : "Complete Profile"}
              </Button>
            )}
          </div>

          <div className="p-6">
            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="space-y-6"
              >
                {/* Personal Info */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) =>
                          setFormData({ ...formData, dob: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gender: e.target.value as typeof formData.gender,
                          })
                        }
                        className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Contact Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Address
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          value={formData.zip}
                          onChange={(e) =>
                            setFormData({ ...formData, zip: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Heart className="w-4 h-4" /> Emergency Contact
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName">Contact Name</Label>
                      <Input
                        id="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContactName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                      <Input
                        id="emergencyContactPhone"
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContactPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Profile"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : hasProfile ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">
                      {patientProfile.firstName} {patientProfile.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{patientProfile.dob || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">
                      {patientProfile.gender?.replace("_", " ") || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{patientProfile.phone || "Not set"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {patientProfile.address
                        ? `${patientProfile.address}${patientProfile.city ? `, ${patientProfile.city}` : ""}${patientProfile.state ? `, ${patientProfile.state}` : ""} ${patientProfile.zip || ""}`
                        : "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Emergency Contact</p>
                    <p className="font-medium">
                      {patientProfile.emergencyContactName || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Emergency Contact Phone
                    </p>
                    <p className="font-medium">
                      {patientProfile.emergencyContactPhone || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Complete Your Profile</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your personal information to get started
                </p>
                <Button onClick={() => setIsEditing(true)}>Get Started</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
