"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

type UploadResponse = { jobId: string; documentId: string };

export default function HomePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Only PDF files are allowed";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be under 20MB";
    }
    return null;
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
      } else {
        setError(null);
        setSelectedFile(file);
      }
    },
    [validateFile]
  );

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("Select a PDF first");
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error || "Upload failed");
      }

      return (await res.json()) as UploadResponse;
    },
    onSuccess: (data) => {
      const name = encodeURIComponent(selectedFile?.name ?? "document.pdf");
      router.push(`/jobs/${data.jobId}?name=${name}`);
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">MemorizeAI</span>
            </div>
            <ThemeToggle />
          </motion.div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Ask anything about your PDF. {" "}
            <span className="gradient-text">Get cited answers</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Upload a PDF and we will extract, chunk, embed, and make it searchable with sources.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <div className="card-elevated p-8">
            <UploadDropzone
              onFileSelect={handleFileSelect}
              onClear={handleClear}
              selectedFile={selectedFile}
              error={error}
              disabled={uploadMutation.isPending}
            />

            <div className="mt-6">
              <Button
                onClick={() => uploadMutation.mutate()}
                disabled={!selectedFile || !!error || uploadMutation.isPending}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Upload PDF
                  </>
                )}
              </Button>
            </div>
            {uploadMutation.error ? (
              <p className="text-sm text-destructive mt-3 text-center">
                {uploadMutation.error.message}
              </p>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid sm:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Cited Answers",
              description: "Every response links back to specific PDF pages",
            },
            {
              title: "Fast Retrieval",
              description: "Vector search over chunked, embedded content",
            },
            {
              title: "Safe Outputs",
              description: "No hallucinations outside retrieved sources",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-xl bg-muted/50"
            >
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
