import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Briefcase, UsersRound, Heart, LogOut, Rocket } from "lucide-react";
import AdminOverview from "../components/admin/AdminOverview";
import AdminStudents from "../components/admin/AdminStudents";
import AdminBusinesses from "../components/admin/AdminBusinesses";
import AdminTeams from "../components/admin/AdminTeams";
import AdminContributions from "../components/admin/AdminContributions";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("startupx_admin") !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const { data: students = [] } = useQuery({
    queryKey: ["admin-students"],
    queryFn: () => base44.entities.students.list(),
  });
  const { data: businesses = [] } = useQuery({
    queryKey: ["admin-businesses"],
    queryFn: () => base44.entities.businesses.list(),
  });
  const { data: teams = [] } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: () => base44.entities.teams.list(),
  });
  const { data: teamMembers = [] } = useQuery({
    queryKey: ["admin-team-members"],
    queryFn: () => base44.entities.team_members.list(),
  });
  const { data: contributions = [] } = useQuery({
    queryKey: ["admin-contributions"],
    queryFn: () => base44.entities.dignity_contributions.list(),
  });
  const { data: requests = [] } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: () => base44.entities.business_requests.list(),
  });

  const logout = () => {
    sessionStorage.removeItem("startupx_admin");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <Rocket className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">StartupX</span>
            </Link>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl font-bold mb-8">Dashboard</h1>

        <Tabs defaultValue="overview">
          <TabsList className="bg-muted mb-6 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="w-4 h-4" />Overview</TabsTrigger>
            <TabsTrigger value="students" className="gap-2"><Users className="w-4 h-4" />Students</TabsTrigger>
            <TabsTrigger value="businesses" className="gap-2"><Briefcase className="w-4 h-4" />Businesses</TabsTrigger>
            <TabsTrigger value="teams" className="gap-2"><UsersRound className="w-4 h-4" />Teams</TabsTrigger>
            <TabsTrigger value="contributions" className="gap-2"><Heart className="w-4 h-4" />Contributions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview students={students} businesses={businesses} contributions={contributions} />
          </TabsContent>
          <TabsContent value="students">
            <AdminStudents students={students} />
          </TabsContent>
          <TabsContent value="businesses">
            <AdminBusinesses businesses={businesses} requests={requests} />
          </TabsContent>
          <TabsContent value="teams">
            <AdminTeams students={students} teams={teams} teamMembers={teamMembers} businesses={businesses} />
          </TabsContent>
          <TabsContent value="contributions">
            <AdminContributions contributions={contributions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}