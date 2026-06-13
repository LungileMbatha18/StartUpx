import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft, User, GraduationCap, Wrench, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MultiSelect from "../components/forms/MultiSelect";

const SKILLS = ["Web Development", "Mobile Development", "UI/UX Design", "Data Analytics", "AI", "Digital Marketing", "Business Analysis", "Project Management"];
const DIGNITY_ITEMS = ["Sanitary Towels", "Deodorant", "Toothpaste", "Toothbrush", "Soap", "Face Cloth", "Other"];
const YEARS = ["First Year", "Second Year", "Third Year", "Fourth Year", "Honours", "Masters", "PhD"];
const HOURS = ["2–4", "5–8", "8–12", "12+"];

export default function RegisterStudent() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    full_name: "", student_number: "", email: "", phone: "",
    institution: "University of the Free State", faculty: "", qualification: "",
    year_of_study: "", skills: [], availability_hours: "", preferred_role: "",
    dignity_contribution_type: "", dignity_items: [], consent: false, status: "Pending",
  });

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.full_name.trim()) e.full_name = "Required";
      if (!form.student_number.trim()) e.student_number = "Required";
      if (!form.email.trim()) e.email = "Required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    }
    if (s === 2) {
      if (!form.year_of_study) e.year_of_study = "Required";
      if (form.skills.length === 0) e.skills = "Select at least one skill";
    }
    if (s === 3) {
      if (!form.consent) e.consent = "You must agree to participate";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const submit = async () => {
    if (!validateStep(3)) return;
    setSubmitting(true);
    await base44.entities.students.create(form);
    if (form.dignity_contribution_type && form.dignity_items.length > 0) {
      await base44.entities.dignity_contributions.create({
        contributor_type: "Student",
        contributor_id: form.student_number,
        contributor_name: form.full_name,
        contribution_type: form.dignity_contribution_type,
        items: form.dignity_items,
      });
    }
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Welcome aboard!</h1>
          <p className="text-muted-foreground mb-8">Your registration has been submitted successfully. We'll review your application and get back to you soon.</p>
          <Link to="/"><Button className="rounded-full px-8 bg-primary">Back to Home</Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Student Registration</h1>
          <p className="text-muted-foreground">Join StartupX and gain real-world experience while making an impact.</p>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="font-heading">Personal Details</CardTitle>
                      <CardDescription>Tell us about yourself</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Full Name *</Label>
                    <Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="John Doe" />
                    {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Student Number *</Label>
                    <Input value={form.student_number} onChange={(e) => set("student_number", e.target.value)} placeholder="2024123456" />
                    {errors.student_number && <p className="text-xs text-destructive">{errors.student_number}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email *</Label>
                    <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="john@ufs.ac.za" />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+27 ..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Institution</Label>
                      <Input value={form.institution} onChange={(e) => set("institution", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Faculty</Label>
                      <Input value={form.faculty} onChange={(e) => set("faculty", e.target.value)} placeholder="e.g. Economic & Management Sciences" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Qualification</Label>
                    <Input value={form.qualification} onChange={(e) => set("qualification", e.target.value)} placeholder="e.g. BCom Information Systems" />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={nextStep} className="rounded-full px-8 bg-primary">Continue</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="font-heading">Skills & Availability</CardTitle>
                      <CardDescription>Help us match you with the right team</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-1.5">
                    <Label>Year of Study *</Label>
                    <Select value={form.year_of_study} onValueChange={(v) => set("year_of_study", v)}>
                      <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent>{YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                    {errors.year_of_study && <p className="text-xs text-destructive">{errors.year_of_study}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Skills *</Label>
                    <MultiSelect options={SKILLS} selected={form.skills} onChange={(v) => set("skills", v)} />
                    {errors.skills && <p className="text-xs text-destructive">{errors.skills}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Weekly Availability</Label>
                    <Select value={form.availability_hours} onValueChange={(v) => set("availability_hours", v)}>
                      <SelectTrigger><SelectValue placeholder="Select hours" /></SelectTrigger>
                      <SelectContent>{HOURS.map((h) => <SelectItem key={h} value={h}>{h} hours/week</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Preferred Role</Label>
                    <Input value={form.preferred_role} onChange={(e) => set("preferred_role", e.target.value)} placeholder="e.g. Frontend Developer, Project Lead" />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-full px-6">Back</Button>
                    <Button onClick={nextStep} className="rounded-full px-8 bg-primary">Continue</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="font-heading">Dignity Drive</CardTitle>
                      <CardDescription>Choose how you'd like to contribute</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-muted-foreground bg-accent/5 rounded-lg p-4 border border-accent/10">
                    Students may contribute individual items, pair up for a shared basket, or provide a complete basket of hygiene essentials.
                  </p>
                  <div className="space-y-1.5">
                    <Label>Contribution Type</Label>
                    <Select value={form.dignity_contribution_type} onValueChange={(v) => set("dignity_contribution_type", v)}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual Item">Individual Item</SelectItem>
                        <SelectItem value="Shared Basket">Shared Basket</SelectItem>
                        <SelectItem value="Complete Basket">Complete Basket</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Items You'll Contribute</Label>
                    <MultiSelect options={DIGNITY_ITEMS} selected={form.dignity_items} onChange={(v) => set("dignity_items", v)} />
                  </div>
                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox id="consent" checked={form.consent} onCheckedChange={(v) => set("consent", v)} />
                    <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                      I agree to participate in StartupX, commit to my team responsibilities, and contribute to the Dignity Drive.
                    </Label>
                  </div>
                  {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="rounded-full px-6">Back</Button>
                    <Button onClick={submit} disabled={submitting} className="rounded-full px-8 bg-primary">
                      {submitting ? "Submitting..." : "Submit Registration"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}