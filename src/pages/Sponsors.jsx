import React from "react";
import { motion } from "framer-motion";
import { Building2, Handshake, Star, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const sponsorTiers = [
  {
    tier: "Platinum",
    color: "from-slate-300 to-slate-100",
    sponsors: [
      { name: "UFS Business Incubator", type: "Strategic Partner" },
      { name: "Enactus UFS Bloemfontein", type: "Community Partner" },
    ],
  },
  {
    tier: "Gold",
    color: "from-yellow-200 to-yellow-100",
    sponsors: [
      { name: "BridgeWork", type: "Program Sponsor" },
    ],
  },
  {
    tier: "Silver",
    color: "from-slate-200 to-slate-50",
    sponsors: [
      { name: "Your Company Here", type: "Sponsor Slot Available" },
      { name: "Your Company Here", type: "Sponsor Slot Available" },
    ],
  },
];

export default function Sponsors() {
  return (
    <div>
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6">
              Our <span className="text-primary">Partners</span> & Sponsors
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              StartupX is made possible through the generous support of our partners and sponsors
              who believe in youth entrepreneurship and community development.
            </p>
          </motion.div>

          <div className="space-y-12">
            {sponsorTiers.map((tier, ti) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ti * 0.15 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Star className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-bold">{tier.tier} Partners</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tier.sponsors.map((sponsor, si) => (
                    <div
                      key={si}
                      className="bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-md transition-all flex flex-col items-center text-center"
                    >
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                        <Building2 className="w-8 h-8 text-foreground/30" />
                      </div>
                      <h3 className="font-heading font-semibold mb-1">{sponsor.name}</h3>
                      <p className="text-sm text-muted-foreground">{sponsor.type}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Handshake className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl font-bold mb-4">Become a Sponsor</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Partner with StartupX to support student entrepreneurship, local business growth,
              and community upliftment through the Dignity Drive. Sponsorship opportunities include
              branding, mentorship access, and direct impact metrics.
            </p>
            <Button size="lg" className="rounded-full px-8 bg-primary">
              <Mail className="w-4 h-4 mr-2" />
              Contact for Sponsorship
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}