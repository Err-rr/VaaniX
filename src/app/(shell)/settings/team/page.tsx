"use client";

import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TEAM_MEMBERS } from "@/data/mock-settings";
import { formatRelativeTime } from "@/lib/utils";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

const ROLE_VARIANT: Record<string, "accent" | "warning" | "info" | "default"> = {
  Admin: "accent",
  "Fraud Analyst": "warning",
  "SOC Analyst": "info",
  Auditor: "default",
};

export default function TeamPage() {
  return (
    <div className="flex flex-col pb-8">
      <PageHeader
        title="Team"
        subtitle="Manage analyst and administrator access"
        actions={
          <Button size="sm" onClick={() => toast.message("Invitation sent")}>
            <UserPlus className="size-3.5" /> Invite Member
          </Button>
        }
      />

      <div className="px-6">
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TEAM_MEMBERS.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <span className="flex items-center gap-2.5">
                      <Avatar>
                        <AvatarFallback>{initials(member.name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-[13px] font-medium text-foreground">{member.name}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-[12.5px] text-foreground-muted">{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={ROLE_VARIANT[member.role]}>{member.role}</Badge>
                  </TableCell>
                  <TableCell className="capitalize text-[12.5px] text-foreground-muted">{member.status}</TableCell>
                  <TableCell className="text-[12.5px] text-foreground-muted">{formatRelativeTime(member.lastActiveAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
