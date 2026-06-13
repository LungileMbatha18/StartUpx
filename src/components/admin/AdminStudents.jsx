import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Filter } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const YEARS = ["All", "First Year", "Second Year", "Third Year", "Fourth Year", "Honours", "Masters", "PhD"];
const SKILLS = ["All", "Web Development", "Mobile Development", "UI/UX Design", "Data Analytics", "AI", "Digital Marketing", "Business Analysis", "Project Management"];

const statusColors = {
  Pending: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Approved: "bg-accent/10 text-accent border-accent/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function AdminStudents({ students }) {
  const [yearFilter, setYearFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("All");
  const queryClient = useQueryClient();

  const filtered = students.filter((s) => {
    if (yearFilter !== "All" && s.year_of_study !== yearFilter) return false;
    if (skillFilter !== "All" && !(s.skills || []).includes(skillFilter)) return false;
    return true;
  });

  const updateStatus = async (id, status) => {
    await base44.entities.students.update(id, { status });
    queryClient.invalidateQueries({ queryKey: ["admin-students"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{YEARS.map((y) => <SelectItem key={y} value={y}>{y === "All" ? "All Years" : y}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>{SKILLS.map((s) => <SelectItem key={s} value={s}>{s === "All" ? "All Skills" : s}</SelectItem>)}</SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length} students</span>
      </div>

      <Card className="border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Student #</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Dignity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.full_name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{s.student_number}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{s.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{s.year_of_study}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(s.skills || []).slice(0, 2).map((sk) => (
                        <Badge key={sk} variant="outline" className="text-xs">{sk}</Badge>
                      ))}
                      {(s.skills || []).length > 2 && <Badge variant="outline" className="text-xs">+{s.skills.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.dignity_contribution_type || "—"}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${statusColors[s.status] || statusColors.Pending}`}>{s.status || "Pending"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {s.status !== "Approved" && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-accent" onClick={() => updateStatus(s.id, "Approved")}>
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      )}
                      {s.status !== "Rejected" && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => updateStatus(s.id, "Rejected")}>
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No students found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}