"use client";

import type { VoiceProfile } from "@/types/voice";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Fingerprint } from "lucide-react";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function VoiceProfilesTable({ profiles }: { profiles: VoiceProfile[] }) {
  if (profiles.length === 0) {
    return <EmptyState icon={Fingerprint} title="No voice profiles" description="No enrolled profiles match the current filters." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Profile</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Enrolled</TableHead>
          <TableHead>Speaker Consistency</TableHead>
          <TableHead>Last Verified</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell>
              <span className="flex items-center gap-2.5">
                <Avatar>
                  <AvatarFallback>{initials(profile.name)}</AvatarFallback>
                </Avatar>
                <span>
                  <span className="block text-[13px] font-medium text-foreground">{profile.name}</span>
                  <span className="block font-mono text-[11px] text-foreground-faint">{profile.id}</span>
                </span>
              </span>
            </TableCell>
            <TableCell className="text-[12.5px] text-foreground">{profile.role}</TableCell>
            <TableCell className="text-[12.5px] text-foreground-muted">{profile.department}</TableCell>
            <TableCell className="text-[12.5px] text-foreground-muted">{formatDateTime(profile.enrolledAt)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="tabular w-8 text-[13px] font-medium text-foreground">{profile.speakerConsistency}%</span>
                <Progress value={profile.speakerConsistency} className="w-20" />
              </div>
            </TableCell>
            <TableCell className="text-[12.5px] text-foreground-muted">{formatRelativeTime(profile.lastVerifiedAt)}</TableCell>
            <TableCell>
              <StatusBadge status={profile.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
