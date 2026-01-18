import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

export interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
  status: "pending" | "active" | "complete";
}

interface JobLogListProps {
  logs: LogEntry[];
}

export function JobLogList({ logs }: JobLogListProps) {
  if (logs.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Processing Log
      </p>
      <div className="space-y-2">
        {logs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-2 text-sm"
          >
            <div className="flex-shrink-0 mt-0.5">
              {log.status === "complete" && (
                <CheckCircle2 className="w-4 h-4 text-success" />
              )}
              {log.status === "active" && (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              )}
              {log.status === "pending" && (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={log.status === "pending" ? "text-muted-foreground" : "text-foreground"}>
                {log.message}
              </p>
            </div>
            <span className="flex-shrink-0 text-xs text-muted-foreground font-mono">
              {log.timestamp}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
