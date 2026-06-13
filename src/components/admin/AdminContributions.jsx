import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Heart, ShoppingBag } from "lucide-react";

const typeIcons = {
  "Complete Basket": Package,
  "Shared Basket": Heart,
  "Individual Item": ShoppingBag,
};

const typeColors = {
  "Complete Basket": "bg-accent/10 text-accent border-accent/20",
  "Shared Basket": "bg-chart-3/10 text-chart-3 border-chart-3/20",
  "Individual Item": "bg-chart-4/10 text-chart-4 border-chart-4/20",
};

export default function AdminContributions({ contributions }) {
  const summary = { "Complete Basket": 0, "Shared Basket": 0, "Individual Item": 0 };
  contributions.forEach((c) => { if (summary[c.contribution_type] !== undefined) summary[c.contribution_type]++; });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(summary).map(([type, count]) => {
          const Icon = typeIcons[type];
          return (
            <Card key={type} className="border-border/50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColors[type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{type}s</p>
                  <p className="text-2xl font-display font-bold">{count}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Contributor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contribution</TableHead>
                <TableHead>Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributions.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{c.contributor_name}</p>
                      <p className="text-xs text-muted-foreground">{c.contributor_type}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{c.contributor_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${typeColors[c.contribution_type]}`}>{c.contribution_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(c.items || []).map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">{item}</Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {contributions.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No contributions yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}