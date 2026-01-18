"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobStatusCard } from "@/components/JobStatusCard";
import { JobStatus as StatusPillStatus } from "@/components/ui/status-pill";
import { LogEntry } from "@/components/JobLogList";
import { FlashcardsView } from "@/components/FlashcardsView";

type JobStatusResponse = {
  id: string;
  status: "queued" | "processing" | "ready" | "failed";
  stage: "queued" | "extracting" | "chunking" | "embedding" | "ready" | "failed";
  errorMessage: string | null;
  documentId: string;
};

type AskResponse = {
  answer: string;
  citations: Array<{
    chunkId: string;
    pageStart: number | null;
    pageEnd: number | null;
    snippet: string;
  }>;
};

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  chunkId?: string;
  pageStart?: number | null;
  pageEnd?: number | null;
  snippet?: string;
};

const stageConfig: Record<
  JobStatusResponse["stage"],
  { status: StatusPillStatus; message: string; log: string }
> = {
  queued: {
    status: "queued",
    message: "Queued for processing...",
    log: "PDF uploaded"
  },
  extracting: {
    status: "extracting",
    message: "Extracting text from PDF...",
    log: "Text extraction started"
  },
  chunking: {
    status: "chunking",
    message: "Chunking text for retrieval...",
    log: "Text chunking complete"
  },
  embedding: {
    status: "embedding",
    message: "Creating embeddings...",
    log: "Embeddings generated"
  },
  ready: {
    status: "ready",
    message: "Processing complete!",
    log: "Document ready"
  },
  failed: {
    status: "failed",
    message: "Processing failed",
    log: "Processing failed"
  }
};

export default function JobStatusPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const fileName = searchParams.get("name") || "document.pdf";

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastStage, setLastStage] = useState<JobStatusResponse["stage"] | null>(null);
  const [question, setQuestion] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const jobQuery = useQuery({
    queryKey: ["job", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${params.id}`);
      if (!res.ok) throw new Error("Failed to load job");
      return (await res.json()) as JobStatusResponse;
    },
    enabled: Boolean(params.id),
    refetchInterval: (query) => {
      const data = query.state.data as JobStatusResponse | undefined;
      if (!data) return 2000;
      return data.status === "ready" || data.status === "failed" ? false : 2000;
    }
  });

  const askMutation = useMutation({
    mutationFn: async () => {
      if (!jobQuery.data?.documentId) {
        throw new Error("Document not ready yet");
      }
      if (!question.trim()) {
        throw new Error("Ask a question first");
      }

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: jobQuery.data.documentId,
          question
        })
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error || "Question failed");
      }

      return (await res.json()) as AskResponse;
    }
  });

  const flashcardsMutation = useMutation({
    mutationFn: async () => {
      if (!jobQuery.data?.documentId) {
        throw new Error("Document not ready yet");
      }
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: jobQuery.data.documentId, count: 6 })
      });
      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error || "Flashcards failed");
      }
      const payload = (await res.json()) as { flashcards: Flashcard[] };
      return payload.flashcards;
    },
    onSuccess: (cards) => {
      setFlashcards(cards);
    }
  });

  useEffect(() => {
    const stage = jobQuery.data?.stage;
    if (!stage || stage === lastStage) return;

    const entry = stageConfig[stage];
    setLogs((prev) => {
      const updated = prev.map((log) => ({ ...log, status: "complete" as const }));
      const status = stage === "ready" ? "complete" : "active";
      return [
        ...updated,
        {
          id: `log-${stage}`,
          message: entry.log,
          timestamp: new Date().toLocaleTimeString(),
          status
        }
      ];
    });
    setLastStage(stage);
  }, [jobQuery.data?.stage, lastStage]);

  const statusInfo = useMemo(() => {
    const stage = jobQuery.data?.stage ?? "queued";
    return stageConfig[stage];
  }, [jobQuery.data?.stage]);

  const statusPill = jobQuery.data?.status === "failed" ? "failed" : statusInfo.status;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">MemorizeAI</span>
            </motion.div>

            <Button variant="ghost" onClick={() => router.push("/")} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Upload
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {jobQuery.data?.status === "ready" ? "Your PDF is Ready!" : "Processing Your PDF"}
          </h1>
          <p className="text-muted-foreground">
            {jobQuery.data?.status === "ready"
              ? "Ask questions and review cited answers below."
              : "We're extracting and indexing your document."}
          </p>
        </motion.div>

        <JobStatusCard
          fileName={fileName}
          status={statusPill}
          statusMessage={statusInfo.message}
          logs={logs}
          errorMessage={jobQuery.data?.errorMessage ?? undefined}
          onUploadAnother={() => router.push("/")}
        />

        <div className="mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-3">Ask a question</h2>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="What does the introduction say about the main argument?"
              className="w-full min-h-[120px] rounded-lg border border-border bg-background p-3 text-sm"
            />
            <div className="mt-4 flex items-center gap-3">
              <Button
                onClick={() => askMutation.mutate()}
                disabled={
                  jobQuery.data?.status !== "ready" ||
                  askMutation.isPending ||
                  !question.trim()
                }
              >
                {askMutation.isPending ? "Searching..." : "Get Answer"}
              </Button>
              {jobQuery.data?.status !== "ready" ? (
                <span className="text-xs text-muted-foreground">
                  Available after processing finishes.
                </span>
              ) : null}
            </div>
            {askMutation.error ? (
              <p className="text-sm text-destructive mt-3">
                {askMutation.error.message}
              </p>
            ) : null}

            {askMutation.data ? (
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Answer</h3>
                  <p className="text-sm text-muted-foreground">{askMutation.data.answer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Citations</h3>
                  <div className="space-y-3">
                    {askMutation.data.citations.map((citation) => (
                      <div
                        key={citation.chunkId}
                        className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground"
                      >
                        <p className="font-mono text-foreground">
                          {citation.chunkId} (pages {citation.pageStart ?? "?"}-
                          {citation.pageEnd ?? "?"})
                        </p>
                        <p className="mt-1">{citation.snippet}</p>
                      </div>
                    ))}
                    {askMutation.data.citations.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No citations were returned.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>

        <div className="mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground">Flashcards</h2>
              <Button
                variant="outline"
                onClick={() => flashcardsMutation.mutate()}
                disabled={jobQuery.data?.status !== "ready" || flashcardsMutation.isPending}
              >
                {flashcardsMutation.isPending ? "Generating..." : "Generate Flashcards"}
              </Button>
            </div>
            {flashcardsMutation.error ? (
              <p className="text-sm text-destructive mt-3">
                {flashcardsMutation.error.message}
              </p>
            ) : null}
            {flashcards.length ? (
              <div className="mt-4">
                <FlashcardsView flashcards={flashcards} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-4">
                {jobQuery.data?.status === "ready"
                  ? "No flashcards yet. Click Generate Flashcards."
                  : "Generate flashcards once processing is complete."}
              </p>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
