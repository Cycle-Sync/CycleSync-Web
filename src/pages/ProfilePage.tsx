// src/pages/ProfilePage.tsx
import * as React from "react";
import { format } from "date-fns";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CountryDropdown } from "@/components/customized/country-dropdown";
import api from "@/api/api";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

interface ProfileData {
  id: number;
  user: { id: number; username: string };
  date_of_birth: string;
  country: string; // ISO alpha3 code
  medical_conditions: { id: number; name: string }[];
  last_ovulation: string | null;
  cycle_type: "regular" | "irregular" | "unknown";
  cycle_length: number | null;
  period_length: number | null;
  preferences: string[];
  profile_image: string;
}

interface Condition {
  id: number;
  name: string;
}

interface Cycle {
  id: number;
  start_date: string;
  end_date: string;
  cycle_length: number;
  phase: string;
}

interface Prediction {
  id: number;
  prediction_date: string;
  predicted_start: string;
  confidence: number | null;
  actual_start: string | null;
}

// Form schemas
const personalInfoSchema = z.object({
  username: z.string().min(1, "Username is required"),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  country: z.string().min(3, "Please select a country"),
});

const cycleSettingsSchema = z.object({
  cycle_type: z.enum(["regular", "irregular", "unknown"]),
  cycle_length: z.number().min(1, "Must be at least 1").nullable(),
  period_length: z.number().min(1, "Must be at least 1").nullable(),
  last_ovulation: z.string().nullable(),
});

const medicalConditionsSchema = z.object({
  medical_condition_ids: z.array(z.number()),
});

const preferencesSchema = z.object({
  preferences: z.array(z.string()),
});

export default function ProfilePage() {
  const [profile, setProfile] = React.useState<ProfileData | null>(null);
  const [conditions, setConditions] = React.useState<Condition[]>([]);
  const [cycles, setCycles] = React.useState<Cycle[]>([]);
  const [predictions, setPredictions] = React.useState<Prediction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  // Forms
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: { username: "", date_of_birth: "", country: "" },
  });
  const cycleSettingsForm = useForm<z.infer<typeof cycleSettingsSchema>>({
    resolver: zodResolver(cycleSettingsSchema),
    defaultValues: { cycle_type: "unknown", cycle_length: null, period_length: null, last_ovulation: null },
  });
  const medicalConditionsForm = useForm<z.infer<typeof medicalConditionsSchema>>({
    resolver: zodResolver(medicalConditionsSchema),
    defaultValues: { medical_condition_ids: [] },
  });
  const preferencesForm = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: { preferences: [] },
  });

  // Fetch data on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch profile
        const { data: profileData } = await api.get("/profiles/me/");
        setProfile(profileData);
        personalInfoForm.reset({
          username: profileData.user.username,
          date_of_birth: profileData.date_of_birth,
          country: profileData.country,
        });
        cycleSettingsForm.reset({
          cycle_type: profileData.cycle_type,
          cycle_length: profileData.cycle_length,
          period_length: profileData.period_length,
          last_ovulation: profileData.last_ovulation,
        });
        medicalConditionsForm.reset({
          medical_condition_ids: profileData.medical_conditions.map((c: Condition) => c.id),
        });
        preferencesForm.reset({
          preferences: profileData.preferences,
        });

        // Fetch conditions
        const { data: conditionsData } = await api.get("/conditions/");
        setConditions(conditionsData);

        // Fetch cycles
        const { data: cyclesData } = await api.get("/cycles/");
        setCycles(cyclesData);

        // Fetch predictions
        const { data: predictionsData } = await api.get("/predictions/");
        setPredictions(predictionsData);

        setLoading(false);
      } catch (err: unknown) {
        console.error("API Error:", err);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Submit handlers with proper error narrowing
  const onPersonalInfoSubmit = async (data: z.infer<typeof personalInfoSchema>) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("date_of_birth", data.date_of_birth);
      formData.append("country", data.country);
      if (imageFile) {
        formData.append("profile_image", imageFile);
      }

      const response = await api.patch(`/profiles/${profile!.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(response.data);
      setImageFile(null);
      toast.success("Personal info updated successfully!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Update Error:", err.response?.data || err);
        const detail = err.response?.data?.detail ?? JSON.stringify(err.response?.data) ?? "Unknown error";
        toast.error("Failed to update personal info: " + detail);
      } else {
        console.error("Update Error:", err);
        toast.error("Failed to update personal info: Unknown error");
      }
    }
  };

  const onCycleSettingsSubmit = async (data: z.infer<typeof cycleSettingsSchema>) => {
    try {
      const response = await api.patch(`/profiles/${profile!.id}/`, data);
      setProfile(response.data);
      toast.success("Cycle settings updated successfully!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Update Error:", err.response?.data || err);
        const detail = err.response?.data?.detail ?? JSON.stringify(err.response?.data) ?? "Unknown error";
        toast.error("Failed to update cycle settings: " + detail);
      } else {
        console.error("Update Error:", err);
        toast.error("Failed to update cycle settings: Unknown error");
      }
    }
  };

  const onMedicalConditionsSubmit = async (data: z.infer<typeof medicalConditionsSchema>) => {
    try {
      const response = await api.patch(`/profiles/${profile!.id}/`, {
        medical_condition_ids: data.medical_condition_ids,
      });
      setProfile(response.data);
      toast.success("Medical conditions updated successfully!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Update Error:", err.response?.data || err);
        const detail = err.response?.data?.detail ?? JSON.stringify(err.response?.data) ?? "Unknown error";
        toast.error("Failed to update medical conditions: " + detail);
      } else {
        console.error("Update Error:", err);
        toast.error("Failed to update medical conditions: Unknown error");
      }
    }
  };

  const onPreferencesSubmit = async (data: z.infer<typeof preferencesSchema>) => {
    try {
      const response = await api.patch(`/profiles/${profile!.id}/`, data);
      setProfile(response.data);
      toast.success("Preferences updated successfully!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Update Error:", err.response?.data || err);
        const detail = err.response?.data?.detail ?? JSON.stringify(err.response?.data) ?? "Unknown error";
        toast.error("Failed to update preferences: " + detail);
      } else {
        console.error("Update Error:", err);
        toast.error("Failed to update preferences: Unknown error");
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <Toaster />
        <main className="flex flex-col gap-6 p-4 lg:gap-8 lg:p-6">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="cycle">Cycle Settings</TabsTrigger>
              <TabsTrigger value="conditions">Medical Conditions</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="history">Cycle History</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
            </TabsList>

            {/* Personal Info */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...personalInfoForm}>
                    <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={profile?.profile_image} alt="Profile" />
                          <AvatarFallback>
                            {profile?.user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Label htmlFor="profile-image">Profile Image</Label>
                          <Input id="profile-image" type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                      </div>
                      <FormField
                        control={personalInfoForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="date_of_birth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <CountryDropdown
                                placeholder="Select a country"
                                defaultValue={field.value}
                                onChange={(country) => field.onChange(country.alpha3)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={loading}>
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cycle Settings */}
            <TabsContent value="cycle">
              <Card>
                <CardHeader>
                  <CardTitle>Cycle Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...cycleSettingsForm}>
                    <form onSubmit={cycleSettingsForm.handleSubmit(onCycleSettingsSubmit)} className="space-y-4">
                      <FormField
                        control={cycleSettingsForm.control}
                        name="cycle_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cycle Type</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select cycle type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="regular">Regular</SelectItem>
                                  <SelectItem value="irregular">Irregular</SelectItem>
                                  <SelectItem value="unknown">Unknown</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cycleSettingsForm.control}
                        name="cycle_length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cycle Length (days)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cycleSettingsForm.control}
                        name="period_length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Period Length (days)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cycleSettingsForm.control}
                        name="last_ovulation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Ovulation</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value || null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={loading}>
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Conditions */}
            <TabsContent value="conditions">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...medicalConditionsForm}>
                    <form onSubmit={medicalConditionsForm.handleSubmit(onMedicalConditionsSubmit)} className="space-y-4">
                      <FormField
                        control={medicalConditionsForm.control}
                        name="medical_condition_ids"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Conditions</FormLabel>
                            <div className="grid grid-cols-2 gap-2">
                              {conditions.map((condition) => (
                                <div key={condition.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={field.value.includes(condition.id)}
                                    onCheckedChange={(checked) => {
                                      const newIds = checked
                                        ? [...field.value, condition.id]
                                        : field.value.filter((id) => id !== condition.id);
                                      field.onChange(newIds);
                                    }}
                                  />
                                  <Label className="text-sm">{condition.name}</Label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={loading}>
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Tracking Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...preferencesForm}>
                    <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-4">
                      <FormField
                        control={preferencesForm.control}
                        name="preferences"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferences</FormLabel>
                            <div className="grid grid-cols-2 gap-2">
                              {["cycle", "symptoms", "trends", "predictions"].map((pref) => (
                                <div key={pref} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={field.value.includes(pref)}
                                    onCheckedChange={(checked) => {
                                      const newPrefs = checked
                                        ? [...field.value, pref]
                                        : field.value.filter((p) => p !== pref);
                                      field.onChange(newPrefs);
                                    }}
                                  />
                                  <Label className="text-sm">
                                    {pref.charAt(0).toUpperCase() + pref.slice(1)}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={loading}>
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cycle History */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Cycle History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Cycle Length</TableHead>
                        <TableHead>Phase</TableHead>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cycles.map((cycle) => (
                        <TableRow key={cycle.id}>
                          <TableCell>{format(new Date(cycle.start_date), "PPP")}</TableCell>
                          <TableCell>{format(new Date(cycle.end_date), "PPP")}</TableCell>
                          <TableCell>{cycle.cycle_length} days</TableCell>
                          <TableCell>
                            {cycle.phase.charAt(0).toUpperCase() + cycle.phase.slice(1)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Predictions */}
            <TabsContent value="predictions">
              <Card>
                <CardHeader>
                  <CardTitle>Cycle Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHead>Prediction Date</TableHead>
                        <TableHead>Predicted Start</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Actual Start</TableHead>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {predictions.map((prediction) => (
                        <TableRow key={prediction.id}>
                          <TableCell>
                            {format(new Date(prediction.prediction_date), "PPP")}
                          </TableCell>
                          <TableCell>
                            {format(new Date(prediction.predicted_start), "PPP")}
                          </TableCell>
                          <TableCell>
                            {prediction.confidence
                              ? `${(prediction.confidence * 100).toFixed(0)}%`
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {prediction.actual_start
                              ? format(new Date(prediction.actual_start), "PPP")
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
