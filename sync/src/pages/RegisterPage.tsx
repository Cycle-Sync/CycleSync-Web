// src/pages/RegisterPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import CircularProgress from "@/components/customized/progress/progress-10"; // or wherever you place it

import api from "@/api/api";

interface Condition {
  id: number;
  name: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/app/dashboard";

  // Multi-step form state
  const [step, setStep] = useState(0);
  const totalSteps = 5;
  const progressValue = Math.round((step / (totalSteps - 1)) * 100);

  // Form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const [lastOvulation, setLastOvulation] = useState("");
  const [cycleType, setCycleType] = useState<"regular"|"irregular"|"unknown">("unknown");
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<number[]>([]);
  const [conditionsList, setConditionsList] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch available conditions for step 3
  useEffect(() => {
    async function loadConditions() {
      try {
        const resp = await api.get<Condition[]>("/conditions/");
        setConditionsList(resp.data);
      } catch {
        // ignore
      }
    }
    loadConditions();
  }, []);

  function next() {
    if (step < totalSteps - 1) setStep(step + 1);
  }
  function prev() {
    if (step > 0) setStep(step - 1);
  }

  async function handleSubmit() {
    if (!username || !password) {
      toast.error("Username & password are required.");
      setStep(0);
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register/", {
        username,
        password,
        date_of_birth: dateOfBirth,
        country,
        last_ovulation: lastOvulation,
        cycle_type: cycleType,
        cycle_length: cycleLength,
        period_length: periodLength,
        preferences,
        medical_conditions: medicalConditions,
      });
      toast.success("Registration successful!");
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CircularProgress
              value={progressValue}
              size={60}
              showLabel
              renderLabel={(v) => `${v}%`}
              className="stroke-blue-200"
              progressClassName="stroke-blue-600"
            />
          </div>
          <CardDescription>
            Step {step + 1} of {totalSteps}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 0 && (
            <div className="space-y-4">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <label className="block">
                <span>Date of Birth</span>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </label>

              <label className="block">
                <span>Country Code</span>
                <Input
                  placeholder="e.g. US, FR, UG"
                  value={country}
                  onChange={(e) => setCountry(e.target.value.toUpperCase())}
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block">
                <span>Last Ovulation</span>
                <Input
                  type="date"
                  value={lastOvulation}
                  onChange={(e) => setLastOvulation(e.target.value)}
                />
              </label>

              <div className="flex space-x-2">
                <Select
                  value={cycleType}
                  onValueChange={(v) => setCycleType(v as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Cycle Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="irregular">Irregular</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={21}
                  placeholder="Cycle Length"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(+e.target.value)}
                />
                <Input
                  type="number"
                  min={3}
                  placeholder="Period Length"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(+e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <span className="block mb-1">Preferences</span>
                {["cycle", "symptoms", "pregnancy", "diet", "hormone"].map((opt) => (
                  <label key={opt} className="flex items-center space-x-2">
                    <Checkbox
                      checked={preferences.includes(opt)}
                      onCheckedChange={(checked) => {
                        setPreferences((prev) =>
                          checked
                            ? [...prev, opt]
                            : prev.filter((p) => p !== opt)
                        );
                      }}
                    />
                    <span className="capitalize">{opt}</span>
                  </label>
                ))}
              </div>

              <div>
                <span className="block mb-1">Medical Conditions</span>
                {conditionsList.map((c) => (
                  <label key={c.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={medicalConditions.includes(c.id)}
                      onCheckedChange={(checked) => {
                        setMedicalConditions((prev) =>
                          checked
                            ? [...prev, c.id]
                            : prev.filter((id) => id !== c.id)
                        );
                      }}
                    />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <p className="font-semibold">Review & Submit</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li><strong>Username:</strong> {username}</li>
                <li><strong>DOB:</strong> {dateOfBirth}</li>
                <li><strong>Country:</strong> {country}</li>
                <li><strong>Last Ovulation:</strong> {lastOvulation}</li>
                <li><strong>Cycle Type:</strong> {cycleType}</li>
                <li><strong>Cycle Length:</strong> {cycleLength} days</li>
                <li><strong>Period Length:</strong> {periodLength} days</li>
                <li><strong>Preferences:</strong> {preferences.join(", ")}</li>
                <li><strong>Conditions:</strong> {medicalConditions.join(", ") || "None"}</li>
              </ul>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={prev}
            disabled={step === 0 || loading}
          >
            Back
          </Button>
          {step < totalSteps - 1 ? (
            <Button onClick={next} disabled={loading}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting…" : "Submit"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
