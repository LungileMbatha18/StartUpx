import React from "react";
import { Heart, Package, Users, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function DignitySection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-accent/5 via-accent/10 to-primary/5 rounded-3xl p-8 sm:p-12 lg:p-16 border border-accent/20 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <Heart className="w-4 h-4" />
                Dignity Drive
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                Innovation with <span className="text-accent">purpose</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every StartupX participant contributes to the Dignity Drive — a hygiene essentials initiative
                supporting community members in need. Businesses commit one complete dignity basket,
                while students may contribute individual items or team up for shared baskets.
              </p>
              <p className="text-sm text-muted-foreground">
                Items include sanitary towels, deodorant, toothpaste, toothbrushes, soap, face cloths and more.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Package, label: "Complete Basket", desc: "All essential items in one basket" },
                { icon: Users, label: "Shared Basket", desc: "Team up with peers for a full basket" },
                { icon: ShoppingBag, label: "Individual Items", desc: "Contribute specific hygiene items" },
                { icon: Heart, label: "Business Commitment", desc: "Each business sponsors one basket" },
              ].map((item) => (
                <div key={item.label} className="bg-card/80 backdrop-blur rounded-xl p-5 border border-border/50">
                  <item.icon className="w-8 h-8 text-accent mb-3" />
                  <p className="font-heading font-semibold text-sm mb-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}