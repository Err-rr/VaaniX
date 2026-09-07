import type { Call } from "@/types/call";
import { formatDateTime, formatDuration, maskPhoneNumber } from "@/lib/utils";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-foreground-faint">{label}</span>
      <span className="text-[13px] font-medium text-foreground">{value}</span>
    </div>
  );
}

export function CallMeta({ call }: { call: Call }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-7">
      <Field label="Call ID" value={<span className="font-mono">{call.id}</span>} />
      <Field label="Caller" value={<span className="font-mono">{maskPhoneNumber(call.callerNumber)}</span>} />
      <Field label="Claimed Identity" value={`${call.claimedIdentity} — ${call.claimedRole}`} />
      <Field label="Duration" value={<span className="tabular">{formatDuration(call.durationSeconds)}</span>} />
      <Field label="Agent" value={call.agent} />
      <Field label="Organization" value={call.organization} />
      <Field label="Timestamp" value={formatDateTime(call.startedAt)} />
    </div>
  );
}
