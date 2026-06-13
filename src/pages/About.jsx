import React from "react";
import { motion } from "framer-motion";
import { Users, Target, Lightbulb, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const timeline = [
  { step: "01", title: "Register", desc: "Students and businesses sign up through our streamlined registration forms." },
  { step: "02", title: "Team Formation", desc: "Students are placed into balanced, cross-year teams of 3–4 members." },
  { step: "03", title: "Project Matching", desc: "Teams are matched with businesses based on skills and support needed." },
  { step: "04", title: "Build & Deliver", desc: "Teams work on real deliverables — websites, apps, strategies and more." },
  { step: "05", title: "Dignity Drive", desc: "All participants contribute hygiene essentials to the community." },
];

const values = [
  { icon: Target, title: "Practical Learning", desc: "Bridging the gap between classroom theory and industry practice." },
  { icon: Users, title: "Collaboration", desc: "Cross-disciplinary teams that mirror real startup environments." },
  { icon: Lightbulb, title: "Innovation", desc: "Fresh perspectives solving real business challenges in the local economy." },
  { icon: Heart, title: "Social Impact", desc: "Every project contributes to community upliftment through the Dignity Drive." },
];

export default function About() {
  return (
    <div>
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              About <span className="text-primary">StartupX</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              StartupX is a 48-hour innovation challenge where student entrepreneurs and student innovators
              come together to solve real business challenges through technology.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Participants work in multidisciplinary teams to develop websites, business systems, digital
              tools, and innovative solutions for student businesses.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The challenge combines entrepreneurship, innovation, technology, and social impact to create
              meaningful outcomes for businesses, students, and the wider community.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <v.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-heading font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold mb-12">How It Works</h2>
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-display font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div className="pb-6 border-b border-border/50 flex-1">
                  <h3 className="font-heading font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold mb-8">Team Formation Model</h2>
          <div className="bg-card rounded-2xl p-8 border border-border/50 max-w-3xl">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Teams are carefully constructed to maximize learning and impact. Each team of 3–4 students prioritizes a balance across years of study:
            </p>
            <div className="space-y-3">
              {[
                "One First Year student — gaining foundational exposure",
                "One Second Year student — building on fundamentals",
                "One Third Year student — applying advanced knowledge",
                "One Honours/Masters/PhD student (when available) — mentoring and leading",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to get involved?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join the next cohort of StartupX and make an impact.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register/student">
              <Button size="lg" className="rounded-full px-8 bg-primary">
                Register as Student <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/register/business">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                Register as Business <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}