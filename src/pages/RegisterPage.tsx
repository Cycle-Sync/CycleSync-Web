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
import { Checkbox } from "@/components/ui/checkbox";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import type { Country} from "@/components/ui/country-dropdown";
import { CircularProgress } from "@/components/customized/progress/progress-10";
import api from "@/api/api";

interface Condition {
  id: number;
  name: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/app/dashboard";

  const [step, setStep] = useState(0);
  const totalSteps = 5;
  const progressValue = Math.round((step / (totalSteps - 1)) * 100);

  // form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState<Country | null>(null);
  const [lastOvulation, setLastOvulation] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<number[]>([]);
  const [conditionsList, setConditionsList] = useState<Condition[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [loading, setLoading] = useState(false);

  // load medical conditions
  useEffect(() => {
    api
      .get<Condition[]>("/conditions/")
      .then((resp) => setConditionsList(resp.data))
      .catch(() => {});
  }, []);

  // validation per step
  const validateStep = () => {
    switch (step) {
      case 0:
        return username.trim().length >= 3 && password.length >= 6;
      case 1:
        return !!dateOfBirth && country !== null;
      case 2:
        return (
          !!lastOvulation &&
          cycleLength >= 21 &&
          cycleLength <= 40 &&
          periodLength >= 3 &&
          periodLength <= 10
        );
      case 3:
        return preferences.length > 0;
      default:
        return true;
    }
  };

  const next = () => {
    if (!validateStep()) {
      setErrorMsg("Please complete all required fields correctly.");
      return;
    }
    setErrorMsg("");
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const prev = () => {
    setErrorMsg("");
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/auth/register/", {
        username,
        password,
        date_of_birth: dateOfBirth,
        country: country!.alpha3,
        last_ovulation: lastOvulation,
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
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CircularProgress
              value={progressValue}
              size={60}
              showLabel
              renderLabel={(v) => `${v}%`}
              className="stroke-blue-200"
              progressClassName="stroke-blue-600"
            />
          </div>
          <CardDescription className="mt-1">
            Step {step + 1} of {totalSteps}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {errorMsg && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errorMsg}
            </p>
          )}

          {step === 0 && (
            <div className="space-y-4">
              <Input
                placeholder="Username (min 3 chars)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm">
                <span>Date of Birth</span>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </label>
              <div className="space-y-1">
                <span className="block text-sm">Country</span>
                <CountryDropdown
                  placeholder="Select a country"
                  defaultValue={country?.alpha3}
                  onChange={setCountry}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm">
                <span>Last Ovulation</span>
                <Input
                  type="date"
                  value={lastOvulation}
                  onChange={(e) => setLastOvulation(e.target.value)}
                />
              </label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  min={21}
                  max={40}
                  placeholder="Cycle Length"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(+e.target.value)}
                />
                <Input
                  type="number"
                  min={3}
                  max={10}
                  placeholder="Period Length"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(+e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium mb-2">Preferences</p>
                <div className="grid grid-cols-2 gap-2">
                  {["cycle", "symptoms", "pregnancy", "diet", "hormone"].map(
                    (opt) => (
                      <label key={opt} className="flex items-center space-x-2">
                        <Checkbox
                          checked={preferences.includes(opt)}
                          onCheckedChange={(chk) =>
                            setPreferences((p) =>
                              chk ? [...p, opt] : p.filter((x) => x !== opt)
                            )
                          }
                        />
                        <span className="capitalize">{opt}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Medical Conditions</p>
                <div className="grid grid-cols-2 gap-2">
                  {conditionsList.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Checkbox
                        checked={medicalConditions.includes(c.id)}
                        onCheckedChange={(chk) =>
                          setMedicalConditions((p) =>
                            chk ? [...p, c.id] : p.filter((x) => x !== c.id)
                          )
                        }
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Review & Submit</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Username:</strong> {username}
                </li>
                <li>
                  <strong>DOB:</strong> {dateOfBirth}
                </li>
                <li>
                  <strong>Country:</strong> {country?.name} {country?.emoji}
                </li>
                <li>
                  <strong>Last Ovulation:</strong> {lastOvulation}
                </li>
                <li>
                  <strong>Cycle Length:</strong> {cycleLength} days
                </li>
                <li>
                  <strong>Period Length:</strong> {periodLength} days
                </li>
                <li>
                  <strong>Preferences:</strong> {preferences.join(", ")}
                </li>
                <li>
                  <strong>Conditions:</strong>{" "}
                  {medicalConditions.length
                    ? medicalConditions.join(", ")
                    : "None"}
                </li>
              </ul>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prev} disabled={step === 0 || loading}>
            Back
          </Button>
          {step < totalSteps - 1 ? (
            <Button onClick={next} disabled={!validateStep() || loading}>
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
