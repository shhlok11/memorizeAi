import { cn } from "@/lib/utils";

export type JobStatus = "queued" | "extracting" | "summarizing" | "complete" | "failed";

interface StatusPillProps {
  status: JobStatus;
  className?: string;
}

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  queued: {
    label: "Queued",
    className: "status-queued",
  },
  extracting: {
    label: "Extracting",
    className: "status-extracting",
  },
  summarizing: {
    label: "Summarizing",
    className: "status-summarizing",
  },
  complete: {
    label: "Complete",
    className: "status-complete",
  },
  failed: {
    label: "Failed",
    className: "status-failed",
  },
};

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn("status-pill", config.className, className)}>
      {config.label}
    </span>
  );
}
