import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api";
import { Github, Mail, Upload, User, UserCheck } from "lucide-react";
import React, { useEffect, useState } from "react";

const Settings = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Profile section
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Update form when user data changes
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await api.post("/upload/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.error === false) {
        // Update user context with new data
        login(response.data.data, localStorage.getItem("authToken"));

        setAvatarUrl(response.data.data.avatarUrl);
        setAvatarFile(null);

        toast({
          title: "Avatar uploaded",
          description: "Your profile picture has been updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error?.response?.data?.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put("/auth/update-profile", {
        name,
      });

      if (response.data.error === false) {
        // Update user context with new data
        login(response.data.data, localStorage.getItem("authToken"));

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          error?.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="account">
              <UserCheck className="mr-2 h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and how others see you on the
                  platform
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled={true}
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="h-24 w-24 rounded-full overflow-hidden border flex-shrink-0">
                        <img
                          src={
                            previewUrl ||
                            avatarUrl ||
                            "https://via.placeholder.com/150"
                          }
                          alt="Avatar"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={uploadLoading}
                          className="mb-2"
                        />
                        <Button
                          type="button"
                          onClick={handleAvatarUpload}
                          disabled={!avatarFile || uploadLoading}
                          className="w-full"
                        >
                          {uploadLoading ? "Uploading..." : "Upload Picture"}
                          {!uploadLoading && (
                            <Upload className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          Upload an image (JPG, PNG or GIF) to use as your
                          profile picture
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  View and manage your account details
                </CardDescription>
              </CardHeader>{" "}
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Member Since
                  </h3>
                  <p className="font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Connected Accounts
                  </h3>
                  <div className="space-y-2 mt-2">
                    {/* <div className="flex items-center">
                      <Mail
                        className={`h-5 w-5 mr-2 ${
                          user?.googleId || user?.githubId
                            ? "text-muted-foreground"
                            : "text-green-500"
                        }`}
                      />
                      <span className="font-medium">Email & Password</span>
                      {!(user?.googleId || user?.githubId) && (
                        <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                    </div> */}

                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                        className={`mr-2 ${
                          user?.googleId
                            ? "text-blue-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill={user?.googleId ? "#4285F4" : "#9ca3af"}
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill={user?.googleId ? "#34A853" : "#9ca3af"}
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill={user?.googleId ? "#FBBC05" : "#9ca3af"}
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill={user?.googleId ? "#EA4335" : "#9ca3af"}
                        />
                      </svg>
                      <span
                        className={`font-medium ${
                          user?.googleId ? "" : "text-muted-foreground"
                        }`}
                      >
                        Google
                      </span>
                      {user?.googleId && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          Connected
                        </span>
                      )}
                    </div>

                    <div className="flex items-center">
                      <Github
                        className={`h-5 w-5 mr-2 ${
                          user?.githubId
                            ? "text-gray-800"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          user?.githubId ? "" : "text-muted-foreground"
                        }`}
                      >
                        GitHub
                      </span>
                      {user?.githubId && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                          Connected
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <Button variant="destructive" disabled>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
