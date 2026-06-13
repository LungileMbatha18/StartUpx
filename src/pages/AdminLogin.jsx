import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const ADMIN_PASSWORD = "startupx2025";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("startupx_admin", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <Card className="border-border/50">
          <CardHeader className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">Admin Access</CardTitle>
            <CardDescription>Enter the admin password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter admin password"
                    autoFocus
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
              <Button type="submit" className="w-full rounded-full bg-primary">Sign In</Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}