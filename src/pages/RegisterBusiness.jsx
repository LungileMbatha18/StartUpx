import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft, Briefcase, Settings, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MultiSelect from "../components/forms/MultiSelect";

const INDUSTRIES = ["Technology", "Retail", "Food & Beverage", "Agriculture", "Education", "Health & Wellness", "Accommodation", "Creative Industry", "Other"];
const STAGES = ["Idea Stage", "Less than 6 months", "6–12 months", "1–3 years", "3+ years"];
const SUPPORT = ["Website Development", "CRM Setup", "Booking System", "E-Commerce Support", "Business Automation", "Data Analytics", "Mobile App Development", "Digital Strategy", "Digital Marketing Support", "Other"];
const DIGNITY_ITEMS = ["Sanitary Towels", "Deodorant", "Toothpaste", "Toothbrush", "Soap", "Face Cloth", "Other"];

export default function RegisterBusiness() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    business_name: "", founder_name: "", founder_email: "", founder_phone: "",
    institution: "", industry: "", stage: "", team_size: "", revenue_generating: false,
    support_needed: [], challenge_summary: "",
    dignity_basket_commitment: true, basket_items: DIGNITY_ITEMS.filter(i => i !== "Other"),
    status: "Pending",
  });

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.business_name.trim()) e.business_name = "Required";
      if (!form.founder_name.trim()) e.founder_name = "Required";
      if (!form.founder_email.trim()) e.founder_email = "Required";
      else if (!/\S+@\S+\.\S+/.test(form.founder_email)) e.founder_email = "Invalid email";
    }
    if (s === 2) {
      if (form.support_needed.length === 0) e.support_needed = "Select at least one";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep(step + 1); };

  const submit = async () => {
    if (!validateStep(3)) return;
    setSubmitting(true);
    const biz = await base44.entities.businesses.create({
      ...form,
      team_size: form.team_size ? parseInt(form.team_size) : 0,
    });
    for (const category of form.support_needed) {
      await base44.entities.business_requests.create({
        business_id: biz.id,
        business_name: form.business_name,
        support_category: category,
      });
    }
    if (form.dignity_basket_commitment && form.basket_items.length > 0) {
      await base44.entities.dignity_contributions.create({
        contributor_type: "Business",
        contributor_id: biz.id,
        contributor_name: form.business_name,
        contribution_type: "Complete Basket",
        items: form.basket_items,
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
          <h1 className="font-display text-3xl font-bold mb-4">Application received!</h1>
          <p className="text-muted-foreground mb-8">We'll review your business registration and match you with a student team soon.</p>
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
          <h1 className="font-display text-3xl font-bold mb-2">Business Registration</h1>
          <p className="text-muted-foreground">Register your business to receive dedicated student support.</p>
        </div>
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="b1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Briefcase className="w-5 h-5 text-primary" /></div>
                    <div><CardTitle className="font-heading">Business Details</CardTitle><CardDescription>Tell us about your business</CardDescription></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Business Name *</Label>
                    <Input value={form.business_name} onChange={(e) => set("business_name", e.target.value)} placeholder="e.g. TechFlow Solutions" />
                    {errors.business_name && <p className="text-xs text-destructive">{errors.business_name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Founder Name *</Label>
                      <Input value={form.founder_name} onChange={(e) => set("founder_name", e.target.value)} />
                      {errors.founder_name && <p className="text-xs text-destructive">{errors.founder_name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Founder Email *</Label>
                      <Input type="email" value={form.founder_email} onChange={(e) => set("founder_email", e.target.value)} />
                      {errors.founder_email && <p className="text-xs text-destructive">{errors.founder_email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label>Phone</Label><Input value={form.founder_phone} onChange={(e) => set("founder_phone", e.target.value)} /></div>
                    <div className="space-y-1.5"><Label>Institution</Label><Input value={form.institution} onChange={(e) => set("institution", e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Industry</Label>
                      <Select value={form.industry} onValueChange={(v) => set("industry", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Stage</Label>
                      <Select value={form.stage} onValueChange={(v) => set("stage", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label>Team Size</Label><Input type="number" value={form.team_size} onChange={(e) => set("team_size", e.target.value)} /></div>
                    <div className="space-y-1.5 flex items-end">
                      <div className="flex items-center gap-3 pb-2">
                        <Switch checked={form.revenue_generating} onCheckedChange={(v) => set("revenue_generating", v)} />
                        <Label>Revenue Generating</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={nextStep} className="rounded-full px-8 bg-primary">Continue</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="b2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Settings className="w-5 h-5 text-primary" /></div>
                    <div><CardTitle className="font-heading">Support Needed</CardTitle><CardDescription>What can our student teams help with?</CardDescription></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-1.5">
                    <Label>Support Categories *</Label>
                    <MultiSelect options={SUPPORT} selected={form.support_needed} onChange={(v) => set("support_needed", v)} />
                    {errors.support_needed && <p className="text-xs text-destructive">{errors.support_needed}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Challenge Summary</Label>
                    <Textarea value={form.challenge_summary} onChange={(e) => set("challenge_summary", e.target.value)} placeholder="Briefly describe the main challenges your business faces..." rows={4} />
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
            <motion.div key="b3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><Heart className="w-5 h-5 text-accent" /></div>
                    <div><CardTitle className="font-heading">Dignity Basket</CardTitle><CardDescription>Each business contributes one complete dignity basket</CardDescription></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-muted-foreground bg-accent/5 rounded-lg p-4 border border-accent/10">
                    As part of StartupX, each registered business commits to contributing one complete dignity basket of hygiene essentials.
                  </p>
                  <div className="flex items-center gap-3">
                    <Switch checked={form.dignity_basket_commitment} onCheckedChange={(v) => set("dignity_basket_commitment", v)} />
                    <Label>I commit to contributing a dignity basket</Label>
                  </div>
                  {form.dignity_basket_commitment && (
                    <div className="space-y-1.5">
                      <Label>Basket Items</Label>
                      <MultiSelect options={DIGNITY_ITEMS} selected={form.basket_items} onChange={(v) => set("basket_items", v)} />
                    </div>
                  )}
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