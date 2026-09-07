import type {
  AlertStatus,
  CallDecision,
  CallStatus,
  IntegrationStatus,
  InvestigationStatus,
  ProfileStatus,
} from "@/types/common";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type AnyStatus = CallDecision | AlertStatus | InvestigationStatus | ProfileStatus | IntegrationStatus | CallStatus;

const STATUS_CONFIG: Record<AnyStatus, { label: string; variant: "default" | "critical" | "warning" | "positive" | "accent" | "info" | "outline" }> = {
  // call decisions
  escalated: { label: "Escalated", variant: "critical" },
  verification_required: { label: "Verification Required", variant: "warning" },
  hold: { label: "On Hold", variant: "warning" },
  cleared: { label: "Cleared", variant: "positive" },
  dismissed: { label: "Dismissed", variant: "default" },
  monitoring: { label: "Monitoring", variant: "info" },
  // alert / investigation status
  open: { label: "Open", variant: "accent" },
  investigating: { label: "Investigating", variant: "warning" },
  in_progress: { label: "In Progress", variant: "warning" },
  resolved: { label: "Resolved", variant: "positive" },
  closed: { label: "Closed", variant: "default" },
  // voice profile
  protected: { label: "Protected", variant: "positive" },
  pending: { label: "Pending Enrollment", variant: "default" },
  under_review: { label: "Under Review", variant: "warning" },
  revoked: { label: "Revoked", variant: "critical" },
  // integrations
  connected: { label: "Connected", variant: "positive" },
  ready: { label: "Ready", variant: "info" },
  degraded: { label: "Degraded", variant: "warning" },
  disconnected: { label: "Disconnected", variant: "critical" },
  // call status
  active: { label: "Active", variant: "critical" },
  analyzing: { label: "Analyzing", variant: "warning" },
  completed: { label: "Completed", variant: "default" },
  dropped: { label: "Dropped", variant: "default" },
};

export function StatusBadge({ status, className }: { status: AnyStatus; className?: string }) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: "default" as const };
  return (
    <Badge variant={config.variant} className={cn("whitespace-nowrap", className)}>
      {config.label}
    </Badge>
  );
}
