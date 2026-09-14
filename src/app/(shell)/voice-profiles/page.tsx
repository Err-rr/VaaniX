"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/shared/filter-bar";
import { FilterSelect } from "@/components/shared/filter-select";
import { VoiceProfilesTable } from "@/components/tables/voice-profiles-table";
import { ALL_VOICE_PROFILES } from "@/data/mock-profiles";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "protected", label: "Protected" },
  { value: "under_review", label: "Under Review" },
  { value: "pending", label: "Pending" },
  { value: "revoked", label: "Revoked" },
];

export default function VoiceProfilesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_VOICE_PROFILES.filter((p) => status === "all" || p.status === status).filter(
      (p) => !q || p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.department.toLowerCase().includes(q)
    );
  }, [search, status]);

  return (
    <div className="flex flex-col pb-8">
      <PageHeader
        title="Voice Profiles"
        subtitle="Enrolled speaker embeddings for privileged and monitored identities"
        actions={
          <Button size="sm">
            <UserPlus className="size-3.5" /> Enroll Profile
          </Button>
        }
      />

      <div className="px-6">
        <div className="mb-4 flex items-start gap-3 rounded-md border border-accent/25 bg-accent-soft px-4 py-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent-strong" />
          <p className="text-[12.5px] leading-snug text-accent-strong">
            Voice profiles are represented as protected biometric embeddings, not raw audio recordings. Embeddings
            cannot be reverse-engineered into audible speech and are access-controlled under the organization&apos;s
            retention policy.
          </p>
        </div>

        <Card className="overflow-hidden">
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by name, role, or department…"
          >
            <FilterSelect label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} className="w-full sm:w-[170px]" />
          </FilterBar>
          <VoiceProfilesTable profiles={filtered} />
        </Card>
      </div>
    </div>
  );
}
