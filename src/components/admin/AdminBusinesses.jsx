import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Filter } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const INDUSTRIES = ["All", "Technology", "Retail", "Food & Beverage", "Agriculture", "Education", "Health & Wellness", "Accommodation", "Creative Industry", "Other"];
const SUPPORT = ["All", "Website Development", "CRM Setup", "Booking System", "E-Commerce Support", "Business Automation", "Data Analytics", "Mobile App Development", "Digital Strategy", "Digital Marketing Support", "Other"];

const statusColors = {
  Pending: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Approved: "bg-accent/10 text-accent border-accent/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function AdminBusinesses({ businesses, requests }) {
  const [industryFilter, setIndustryFilter] = useState("All");
  const [supportFilter, setSupportFilter] = useState("All");
  const queryClient = useQueryClient();

  const filtered = businesses.filter((b) => {
    if (industryFilter !== "All" && b.industry !== industryFilter) return false;
    if (supportFilter !== "All" && !(b.support_needed || []).includes(supportFilter)) return false;
    return true;
  });

  const supportCounts = {};
  requests.forEach((r) => { supportCounts[r.support_category] = (supportCounts[r.support_category] || 0) + 1; });

  const updateStatus = async (id, status) => {
    await base44.entities.businesses.update(id, { status });
    queryClient.invalidateQueries({ queryKey: ["admin-businesses"] });
  };

  return (
    <div className="space-y-6">
      {Object.keys(supportCounts).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(supportCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
            <Badge key={cat} variant="secondary" className="text-xs py-1 px-3">
              {cat}: {count}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i === "All" ? "All Industries" : i}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={supportFilter} onValueChange={setSupportFilter}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>{SUPPORT.map((s) => <SelectItem key={s} value={s}>{s === "All" ? "All Support Types" : s}</SelectItem>)}</SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length} businesses</span>
      </div>

      <Card className="border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Business</TableHead>
                <TableHead>Founder</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Support Needed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.business_name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{b.founder_name}<br /><span className="text-xs">{b.founder_email}</span></TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{b.industry}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.stage}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(b.support_needed || []).slice(0, 2).map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                      {(b.support_needed || []).length > 2 && <Badge variant="outline" className="text-xs">+{b.support_needed.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell><Badge className={`text-xs ${statusColors[b.status] || statusColors.Pending}`}>{b.status || "Pending"}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {b.status !== "Approved" && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-accent" onClick={() => updateStatus(b.id, "Approved")}><CheckCircle2 className="w-4 h-4" /></Button>
                      )}
                      {b.status !== "Rejected" && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => updateStatus(b.id, "Rejected")}><XCircle className="w-4 h-4" /></Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No businesses found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}