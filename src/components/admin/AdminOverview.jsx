import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, Clock, Package, ShoppingBag, Heart } from "lucide-react";

function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-display font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminOverview({ students, businesses, contributions }) {
  const pendingStudents = students.filter((s) => s.status === "Pending").length;
  const pendingBusinesses = businesses.filter((b) => b.status === "Pending").length;
  const completeBaskets = contributions.filter((c) => c.contribution_type === "Complete Basket").length;
  const totalIndividualItems = contributions.reduce((sum, c) => {
    if (c.contribution_type === "Individual Item") return sum + (c.items?.length || 0);
    return sum;
  }, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard icon={Users} label="Total Students" value={students.length} color="bg-primary/10 text-primary" />
      <MetricCard icon={Briefcase} label="Total Businesses" value={businesses.length} color="bg-accent/10 text-accent" />
      <MetricCard icon={Clock} label="Pending Students" value={pendingStudents} color="bg-chart-4/10 text-chart-4" />
      <MetricCard icon={Clock} label="Pending Businesses" value={pendingBusinesses} color="bg-chart-5/10 text-chart-5" />
      <MetricCard icon={Package} label="Complete Baskets" value={completeBaskets} color="bg-chart-3/10 text-chart-3" />
      <MetricCard icon={ShoppingBag} label="Individual Items" value={totalIndividualItems} color="bg-destructive/10 text-destructive" />
    </div>
  );
}