import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Now accepting registrations
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            StartupX —{" "}
            <span className="text-primary">Build.</span>{" "}
            <span className="text-accent">Innovate.</span>{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Scale.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A BridgeWork initiative in partnership with the UFS Business Incubator
            and Enactus UFS Bloemfontein.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register/student">
              <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 h-12 text-base">
                <Users className="w-4 h-4 mr-2" />
                Register as Student
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/register/business">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-2">
                <Briefcase className="w-4 h-4 mr-2" />
                Register as Business
              </Button>
            </Link>
            <Link to="/impact">
              <Button size="lg" variant="ghost" className="rounded-full px-8 h-12 text-base text-muted-foreground">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Impact
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}