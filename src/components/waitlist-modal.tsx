// src/components/waitlist-modal.tsx
"use client";

import React, { useState } from "react";
import api from "@/api/api";      // ← your Axios instance
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, AlertCircle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WaitlistData {
  email: string;
  message: string;
}

interface WaitlistModalProps {
  children: React.ReactNode;
}

export function WaitlistModal({ children }: WaitlistModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle"|"success"|"error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateForm = () => {
    const newErr: typeof errors = {};
    if (!email) newErr.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErr.email = "Enter a valid email";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const resetForm = () => {
    setEmail(""); setMessage(""); setErrors({}); setSubmitStatus("idle"); setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload: WaitlistData = { email, message };
      await api.post("/book-demo/", payload);

      setSubmitStatus("success");
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 2000);
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.message;
      setErrorMessage(detail);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Join the Waitlist
          </DialogTitle>
          <DialogDescription>
            Be the first to know when CycleSync launches and get early access to our privacy-first menstrual health
                        tracker.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>Welcome to the waitlist!</AlertDescription>
          </Alert>
        )}
        {submitStatus === "error" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(errors.email && "border-red-500")}
              disabled={isSubmitting || submitStatus === "success"}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="What features are you most excited about?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting || submitStatus === "success"}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || submitStatus==="success"}>
              {isSubmitting
                ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Joining…</>)
                : submitStatus === "success"
                  ? (<><CheckCircle className="mr-2 h-4 w-4"/>Joined!</>)
                  : "Join Waitlist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
