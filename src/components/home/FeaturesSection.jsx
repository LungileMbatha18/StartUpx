import React from "react";
import { Users, Lightbulb, Heart, Rocket, Target, Handshake } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Users,
    title: "Balanced Teams",
    description: "Cross-year student teams bringing diverse perspectives and skills to real business challenges.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Lightbulb,
    title: "Real Projects",
    description: "Work on live business problems — from website builds to full digital strategies for local entrepreneurs.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Heart,
    title: "Dignity Drive",
    description: "Every participant contributes hygiene essentials to support community members in need.",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Rocket,
    title: "Startup Support",
    description: "Businesses receive dedicated student teams providing tech, marketing, and operational solutions.",
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: Target,
    title: "Skill Building",
    description: "Students gain real-world experience in web dev, data analytics, UI/UX, project management and more.",
    color: "bg-chart-4/10 text-chart-4",
  },
  {
    icon: Handshake,
    title: "Community Impact",
    description: "Bridging the gap between academic knowledge and practical entrepreneurship across Bloemfontein.",
    color: "bg-chart-5/10 text-chart-5",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            StartupX connects talented students with local businesses, creating impact through innovation and social responsibility.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}