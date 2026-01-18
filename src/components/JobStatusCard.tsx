import { motion } from "framer-motion";
import { FileText, AlertCircle, RotateCcw, Upload } from "lucide-react";
import { StatusPill, JobStatus } from "@/components/ui/status-pill";
import { ProgressBar } from "@/components/ProgressBar";
import { JobLogList, LogEntry } from "@/components/JobLogList";
import { Button } from "@/components/ui/button";

interface JobStatusCardProps {
  fileName: string;
  status: JobStatus;
  statusMessage: string;
  logs: LogEntry[];
  errorMessage?: string;
  onRetry?: () => void;
  onUploadAnother?: () => void;
}

export function JobStatusCard({
  fileName,
  status,
  statusMessage,
  logs,
  errorMessage,
  onRetry,
  onUploadAnother,
}: JobStatusCardProps) {
  const isFailed = status === "failed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{fileName}</p>
            <p className="text-sm text-muted-foreground">PDF Document</p>
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      {/* Progress Section */}
      {!isFailed && status !== "complete" && (
        <div className="mb-4">
          <ProgressBar indeterminate className="mb-2" />
          <p className="text-sm text-muted-foreground">{statusMessage}</p>
        </div>
      )}

      {/* Error State */}
      {isFailed && errorMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive mb-1">Processing Failed</p>
              <p className="text-sm text-destructive/80">{errorMessage}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons for Failed State */}
      {isFailed && (
        <div className="flex gap-3">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
          {onUploadAnother && (
            <Button onClick={onUploadAnother} className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Upload Another
            </Button>
          )}
        </div>
      )}

      {/* Processing Logs */}
      {!isFailed && <JobLogList logs={logs} />}
    </motion.div>
  );
}
