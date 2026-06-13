import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Users, Sparkles, Trash2, Plus, BrainCircuit, X, Building2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const YEAR_COLORS = {
  "First Year": "bg-blue-100 text-blue-700",
  "Second Year": "bg-purple-100 text-purple-700",
  "Third Year": "bg-orange-100 text-orange-700",
  "Fourth Year": "bg-red-100 text-red-700",
  "Honours": "bg-emerald-100 text-emerald-700",
  "Masters": "bg-teal-100 text-teal-700",
  "PhD": "bg-indigo-100 text-indigo-700",
};

export default function AdminTeams({ students, teams, teamMembers, businesses }) {
  const [localTeams, setLocalTeams] = useState(null); // null = use DB data
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const queryClient = useQueryClient();

  const approvedStudents = useMemo(() => students.filter((s) => s.status === "Approved"), [students]);

  // Build working state from DB data or local state
  const membersByTeam = useMemo(() => {
    const map = {};
    teamMembers.forEach((m) => {
      if (!map[m.team_id]) map[m.team_id] = [];
      map[m.team_id].push(m);
    });
    return map;
  }, [teamMembers]);

  // Working teams = localTeams if editing, else derived from DB
  const workingTeams = localTeams || teams.map((t) => ({
    ...t,
    members: (membersByTeam[t.id] || []).map((m) => ({
      id: m.student_id,
      full_name: m.student_name,
      year_of_study: m.year_of_study,
      role: m.role,
      skills: approvedStudents.find((s) => s.id === m.student_id)?.skills || [],
      team_member_id: m.id,
    })),
  }));

  const assignedStudentIds = useMemo(() => {
    const ids = new Set();
    workingTeams.forEach((t) => t.members?.forEach((m) => ids.add(m.id)));
    return ids;
  }, [workingTeams]);

  const unassignedStudents = approvedStudents.filter((s) => !assignedStudentIds.has(s.id));

  const initEditing = () => {
    if (!localTeams) setLocalTeams(workingTeams.map((t) => ({ ...t, members: [...(t.members || [])] })));
  };

  const addNewTeam = () => {
    initEditing();
    setLocalTeams((prev) => [
      ...(prev || workingTeams),
      { id: `new-${Date.now()}`, name: `Team ${(prev || workingTeams).length + 1}`, members: [], is_balanced: false, matched_business: null },
    ]);
  };

  const deleteTeam = (teamId) => {
    initEditing();
    setLocalTeams((prev) => (prev || workingTeams).filter((t) => t.id !== teamId));
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    initEditing();
    setLocalTeams((prev) => {
      const teams = JSON.parse(JSON.stringify(prev || workingTeams));

      // Find student
      let student = null;
      if (source.droppableId === "unassigned") {
        student = unassignedStudents[source.index];
      } else {
        const srcTeam = teams.find((t) => t.id === source.droppableId);
        if (srcTeam) {
          [student] = srcTeam.members.splice(source.index, 1);
        }
      }
      if (!student) return prev;

      // Place student
      if (destination.droppableId === "unassigned") {
        // Just remove from source (already done above)
      } else {
        const dstTeam = teams.find((t) => t.id === destination.droppableId);
        if (dstTeam) {
          dstTeam.members.splice(destination.index, 0, student);
        }
      }

      return teams;
    });
  };

  const saveChanges = async () => {
    if (!localTeams) return;
    setSaving(true);

    // Delete all existing team_members and teams, rebuild
    for (const tm of teamMembers) {
      await base44.entities.team_members.delete(tm.id);
    }
    for (const t of teams) {
      await base44.entities.teams.delete(t.id);
    }

    for (const lt of localTeams) {
      const newTeam = await base44.entities.teams.create({
        name: lt.name,
        member_count: lt.members.length,
        is_balanced: lt.members.length >= 3,
        generation_batch: lt.generation_batch || new Date().toISOString(),
        matched_business_id: lt.matched_business?.id || null,
        matched_business_name: lt.matched_business?.business_name || null,
      });
      for (const m of lt.members) {
        await base44.entities.team_members.create({
          team_id: newTeam.id,
          student_id: m.id,
          student_name: m.full_name,
          year_of_study: m.year_of_study,
          role: m.role || m.preferred_role || "Member",
        });
      }
    }

    queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
    queryClient.invalidateQueries({ queryKey: ["admin-team-members"] });
    setSaving(false);
    setSaved(true);
    setLocalTeams(null);
    setTimeout(() => setSaved(false), 3000);
  };

  const runAI = async () => {
    setAiLoading(true);
    setAiResult(null);

    const studentData = approvedStudents.map((s) => ({
      id: s.id,
      name: s.full_name,
      year: s.year_of_study,
      skills: s.skills || [],
      preferred_role: s.preferred_role || "",
    }));

    const businessData = businesses.filter((b) => b.status === "Approved").map((b) => ({
      id: b.id,
      name: b.business_name,
      industry: b.industry,
      support_needed: b.support_needed || [],
      challenge: b.challenge_summary || "",
    }));

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert team formation coordinator for a 48-hour startup challenge.

Given these approved students:
${JSON.stringify(studentData, null, 2)}

And these businesses needing support:
${JSON.stringify(businessData, null, 2)}

Form balanced multidisciplinary teams of 3-4 students each. Rules:
- Each team should have a mix of different year levels (prefer: 1st/2nd/3rd year + postgrad)
- Each team should have complementary skills to match business needs
- Assign each team to the most suitable business based on skills vs support_needed
- Every student must be assigned to exactly one team
- Every business should be matched to at most one team

Return a JSON object with a "teams" array. Each team: { name, student_ids: [...], matched_business_id, reasoning }`,
      response_json_schema: {
        type: "object",
        properties: {
          teams: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                student_ids: { type: "array", items: { type: "string" } },
                matched_business_id: { type: "string" },
                reasoning: { type: "string" },
              },
            },
          },
        },
      },
    });

    const studentMap = {};
    approvedStudents.forEach((s) => { studentMap[s.id] = s; });
    const businessMap = {};
    businesses.forEach((b) => { businessMap[b.id] = b; });

    const formed = (result.teams || []).map((t, i) => ({
      id: `ai-${i}-${Date.now()}`,
      name: t.name || `Team ${i + 1}`,
      members: (t.student_ids || []).map((sid) => studentMap[sid]).filter(Boolean).map((s) => ({
        id: s.id,
        full_name: s.full_name,
        year_of_study: s.year_of_study,
        role: s.preferred_role || "Member",
        skills: s.skills || [],
      })),
      matched_business: businessMap[t.matched_business_id] || null,
      reasoning: t.reasoning,
      is_balanced: true,
      generation_batch: new Date().toISOString(),
    }));

    setLocalTeams(formed);
    setAiResult({ count: formed.length });
    setAiLoading(false);
  };

  const isDirty = localTeams !== null;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {approvedStudents.length} approved students · {unassignedStudents.length} unassigned
          {isDirty && <span className="ml-2 text-orange-500 font-medium">● Unsaved changes</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={addNewTeam}>
            <Plus className="w-4 h-4" /> New Team
          </Button>
          <Button size="sm" onClick={runAI} disabled={aiLoading} className="rounded-full gap-2 bg-chart-3 hover:bg-chart-3/90 text-white">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
            AI Form & Match Teams
          </Button>
          {isDirty && (
            <Button size="sm" onClick={saveChanges} disabled={saving} className="rounded-full gap-2 bg-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              Save Teams
            </Button>
          )}
          {saved && <span className="text-sm text-accent font-medium self-center">✓ Saved!</span>}
        </div>
      </div>

      {aiResult && (
        <Card className="border-chart-3/30 bg-chart-3/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-chart-3 shrink-0 mt-0.5" />
            <p className="text-sm">AI formed <strong>{aiResult.count}</strong> teams with skill-based matching and business assignments. Review below and save when ready.</p>
          </CardContent>
        </Card>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Unassigned pool */}
          <div className="lg:col-span-1">
            <h3 className="font-heading font-semibold text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" /> Unassigned ({unassignedStudents.length})
            </h3>
            <Droppable droppableId="unassigned">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] rounded-xl border-2 border-dashed p-3 space-y-2 transition-colors ${
                    snapshot.isDraggingOver ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  {unassignedStudents.map((s, i) => (
                    <Draggable key={s.id} draggableId={s.id} index={i}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-card rounded-lg p-2.5 border border-border/50 cursor-grab active:cursor-grabbing transition-shadow ${
                            snapshot.isDragging ? "shadow-lg ring-2 ring-primary/30" : "hover:shadow-sm"
                          }`}
                        >
                          <p className="text-xs font-medium truncate">{s.full_name}</p>
                          <Badge className={`text-xs mt-1 ${YEAR_COLORS[s.year_of_study] || "bg-muted text-muted-foreground"}`}>
                            {s.year_of_study}
                          </Badge>
                          {(s.skills || []).length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">{s.skills.slice(0, 2).join(", ")}</p>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {unassignedStudents.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">All students assigned</p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Teams grid */}
          <div className="lg:col-span-3">
            {workingTeams.length === 0 && !isDirty ? (
              <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="mb-2">No teams yet.</p>
                <p className="text-sm">Use <strong>AI Form & Match Teams</strong> or create teams manually.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {workingTeams.map((team) => (
                  <div key={team.id} className="flex flex-col">
                    <Card className="border-border/50 flex-1">
                      <CardHeader className="pb-2 pt-4 px-4">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="font-heading text-sm flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-primary" />
                            {team.name}
                          </CardTitle>
                          <div className="flex items-center gap-1">
                            {team.is_balanced && <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">Balanced</Badge>}
                            <button onClick={() => deleteTeam(team.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        {team.matched_business && (
                          <div className="flex items-center gap-1.5 mt-1.5 bg-primary/5 rounded-md px-2 py-1">
                            <Building2 className="w-3 h-3 text-primary shrink-0" />
                            <p className="text-xs text-primary font-medium truncate">{team.matched_business.business_name}</p>
                          </div>
                        )}
                        {team.reasoning && (
                          <p className="text-xs text-muted-foreground mt-1 italic line-clamp-2">{team.reasoning}</p>
                        )}
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0">
                        <Droppable droppableId={team.id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`min-h-[80px] rounded-lg border-2 border-dashed p-2 space-y-1.5 transition-colors ${
                                snapshot.isDraggingOver ? "border-primary bg-primary/5" : "border-border/40"
                              }`}
                            >
                              {(team.members || []).map((m, i) => (
                                <Draggable key={m.id} draggableId={m.id} index={i}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`bg-background rounded-md px-2 py-1.5 border border-border/50 cursor-grab active:cursor-grabbing flex items-center justify-between gap-2 ${
                                        snapshot.isDragging ? "shadow-lg ring-2 ring-primary/30" : ""
                                      }`}
                                    >
                                      <div className="min-w-0">
                                        <p className="text-xs font-medium truncate">{m.full_name}</p>
                                        {m.role && <p className="text-xs text-muted-foreground truncate">{m.role}</p>}
                                      </div>
                                      <Badge className={`text-xs shrink-0 ${YEAR_COLORS[m.year_of_study] || "bg-muted text-muted-foreground"}`}>
                                        {m.year_of_study?.replace(" Year", "Y").replace("First", "1st").replace("Second", "2nd").replace("Third", "3rd").replace("Fourth", "4th")}
                                      </Badge>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {(team.members || []).length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-3">Drop students here</p>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}