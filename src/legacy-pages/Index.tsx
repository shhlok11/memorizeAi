import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export default function Index() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    // Simulate upload delay - in real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Generate a mock job ID - in real app, this comes from the API
    const jobId = `job_${Date.now()}`;
    
    // Navigate to job status page
    navigate(`/jobs/${jobId}`, { state: { fileName: selectedFile.name } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Upload a PDF.{" "}
            <span className="gradient-text">Get clean notes</span> in minutes.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Transform your lecture notes, handouts, and study materials into structured notes, summaries, and flashcards.
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
              disabled={isUploading}
            />

            <div className="mt-6">
              <Button
                onClick={handleSubmit}
                disabled={!selectedFile || !!error || isUploading}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Notes
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid sm:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Structured Notes",
              description: "Clean, organized notes with headings and bullet points",
            },
            {
              title: "Smart Summary",
              description: "Key concepts distilled into concise paragraphs",
            },
            {
              title: "Flashcards",
              description: "Question-answer pairs for effective studying",
            },
          ].map((feature, index) => (
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
