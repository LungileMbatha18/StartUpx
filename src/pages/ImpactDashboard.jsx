import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Briefcase, UsersRound, Package, Heart, ShoppingBag, RefreshCw, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

const BASKET_GOAL = 100;
const CHART_COLORS = ["hsl(217, 91%, 60%)", "hsl(160, 84%, 39%)", "hsl(262, 83%, 58%)", "hsl(43, 74%, 66%)", "hsl(12, 76%, 61%)", "hsl(200, 70%, 50%)", "hsl(330, 65%, 55%)"];

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="border-border/50 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{label}</p>
              <p className="text-3xl font-display font-bold">{value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ImpactDashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { data: students = [] } = useQuery({
    queryKey: ["impact-students"],
    queryFn: () => base44.entities.students.list(),
    refetchInterval: 30000,
  });
  const { data: businesses = [] } = useQuery({
    queryKey: ["impact-businesses"],
    queryFn: () => base44.entities.businesses.list(),
    refetchInterval: 30000,
  });
  const { data: teams = [] } = useQuery({
    queryKey: ["impact-teams"],
    queryFn: () => base44.entities.teams.list(),
    refetchInterval: 30000,
  });
  const { data: contributions = [] } = useQuery({
    queryKey: ["impact-contributions"],
    queryFn: () => base44.entities.dignity_contributions.list(),
    refetchInterval: 30000,
  });
  const { data: requests = [] } = useQuery({
    queryKey: ["impact-requests"],
    queryFn: () => base44.entities.business_requests.list(),
    refetchInterval: 30000,
  });

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const completeBaskets = contributions.filter((c) => c.contribution_type === "Complete Basket").length;
  const sharedBaskets = contributions.filter((c) => c.contribution_type === "Shared Basket").length;
  const individualItems = contributions.reduce((sum, c) => {
    if (c.contribution_type === "Individual Item") return sum + (c.items?.length || 0);
    return sum;
  }, 0);
  const allItems = contributions.reduce((sum, c) => sum + (c.items?.length || 0), 0);

  const basketProgress = Math.min(100, Math.round((completeBaskets / BASKET_GOAL) * 100));

  const yearData = ["First Year", "Second Year", "Third Year", "Fourth Year", "Honours", "Masters", "PhD"]
    .map((y) => ({ name: y.replace(" Year", "").replace("First", "1st").replace("Second", "2nd").replace("Third", "3rd").replace("Fourth", "4th"), count: students.filter((s) => s.year_of_study === y).length }))
    .filter((d) => d.count > 0);

  const supportMap = {};
  requests.forEach((r) => { supportMap[r.support_category] = (supportMap[r.support_category] || 0) + 1; });
  const supportData = Object.entries(supportMap).map(([name, count]) => ({ name: name.length > 15 ? name.slice(0, 15) + "…" : name, count })).sort((a, b) => b.count - a.count);

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2">
            <div>
              <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
                <RefreshCw className="w-3 h-3 mr-1" /> Live Data
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold">Impact Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Updated {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Real-time metrics from the StartupX platform. Auto-refreshes every 30 seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Students Registered" value={students.length} color="bg-primary/10 text-primary" delay={0} />
          <StatCard icon={Briefcase} label="Businesses Registered" value={businesses.length} color="bg-accent/10 text-accent" delay={0.05} />
          <StatCard icon={UsersRound} label="Teams Generated" value={teams.length} color="bg-chart-3/10 text-chart-3" delay={0.1} />
          <StatCard icon={Package} label="Complete Baskets" value={completeBaskets} color="bg-chart-5/10 text-chart-5" delay={0.15} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Heart} label="Shared Basket Groups" value={sharedBaskets} color="bg-destructive/10 text-destructive" delay={0.2} />
          <StatCard icon={ShoppingBag} label="Individual Items Pledged" value={individualItems} color="bg-chart-4/10 text-chart-4" delay={0.25} />
          <div className="col-span-2 lg:col-span-1">
            <StatCard icon={Package} label="Total Items Pledged" value={allItems} color="bg-primary/10 text-primary" delay={0.3} />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="border-border/50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-heading font-semibold">Basket Goal Progress</p>
                  <p className="text-sm text-muted-foreground">{completeBaskets} of {BASKET_GOAL} complete baskets</p>
                </div>
                <span className="text-2xl font-display font-bold text-primary">{basketProgress}%</span>
              </div>
              <Progress value={basketProgress} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {yearData.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-border/50">
                <CardHeader><CardTitle className="font-heading text-lg">Students by Year of Study</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={yearData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {yearData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {supportData.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Card className="border-border/50">
                <CardHeader><CardTitle className="font-heading text-lg">Businesses by Support Category</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={supportData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {supportData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {yearData.length === 0 && supportData.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No data yet. Charts will appear once registrations come in.</p>
          </div>
        )}
      </div>
    </div>
  );
}