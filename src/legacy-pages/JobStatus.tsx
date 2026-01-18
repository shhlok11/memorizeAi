import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { JobStatusCard } from "@/components/JobStatusCard";
import { ResultsTabs } from "@/components/ResultsTabs";
import { Button } from "@/components/ui/button";
import { JobStatus as JobStatusType } from "@/components/ui/status-pill";
import { LogEntry } from "@/components/JobLogList";

// Mock data for demonstration
const mockNotes = `# Introduction to Machine Learning

Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience.

## Key Concepts

• Supervised Learning - Training with labeled data
• Unsupervised Learning - Finding patterns in unlabeled data
• Reinforcement Learning - Learning through trial and error

## Applications

• Image and speech recognition
• Natural language processing
• Recommendation systems
• Autonomous vehicles

## Important Algorithms

### Linear Regression
Used for predicting continuous values based on input features.

### Decision Trees
Tree-like models for classification and regression tasks.

### Neural Networks
Inspired by biological neural networks, excellent for complex pattern recognition.`;

const mockSummary = `Machine learning is a fundamental branch of AI that allows computers to learn from data without explicit programming. The field encompasses three main paradigms: supervised learning (using labeled examples), unsupervised learning (discovering hidden patterns), and reinforcement learning (learning through feedback).

**Key Takeaway:** Understanding these core concepts is essential for any AI practitioner.

The most impactful applications include image recognition, natural language processing, and recommendation systems that power services we use daily.

Common algorithms range from simple linear regression for continuous predictions to complex neural networks that excel at pattern recognition in unstructured data.`;

const mockFlashcards = [
  {
    id: "1",
    question: "What are the three main types of machine learning?",
    answer: "Supervised learning, unsupervised learning, and reinforcement learning.",
  },
  {
    id: "2",
    question: "What is supervised learning?",
    answer: "A type of machine learning where the model is trained on labeled data, learning to map inputs to known outputs.",
  },
  {
    id: "3",
    question: "What is the key difference between supervised and unsupervised learning?",
    answer: "Supervised learning uses labeled data with known outcomes, while unsupervised learning finds patterns in unlabeled data without predefined outputs.",
  },
  {
    id: "4",
    question: "Name three applications of machine learning.",
    answer: "Image recognition, natural language processing, and recommendation systems.",
  },
  {
    id: "5",
    question: "What are neural networks inspired by?",
    answer: "Biological neural networks in the human brain.",
  },
];

// Job status progression simulation
const statusProgression: Array<{
  status: JobStatusType;
  message: string;
  log: string;
}> = [
  { status: "queued", message: "Queued for processing...", log: "PDF uploaded" },
  { status: "extracting", message: "Extracting text from PDF...", log: "Text extraction started" },
  { status: "embedding", message: "Generating embeddings...", log: "Embedding request sent" },
  { status: "ready", message: "Processing complete!", log: "Notes generated" },
];

export default function JobStatus() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileName = (location.state as { fileName?: string })?.fileName || "document.pdf";

  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  // Simulate polling - in real app, this would be actual API polling
  useEffect(() => {
    if (hasFailed || currentStep >= statusProgression.length) return;

    const timeout = setTimeout(() => {
      const step = statusProgression[currentStep];
      
      // Add log entry
      setLogs((prev) => [
        ...prev.map((log) => ({ ...log, status: "complete" as const })),
        {
          id: `log_${currentStep}`,
          message: step.log,
          timestamp: new Date().toLocaleTimeString(),
          status: step.status === "ready" ? "complete" : "active",
        },
      ]);

      setCurrentStep((prev) => prev + 1);

      // Show results when complete
      if (step.status === "ready") {
        setTimeout(() => setShowResults(true), 500);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [currentStep, hasFailed]);

  const handleRetry = useCallback(() => {
    setHasFailed(false);
    setCurrentStep(0);
    setLogs([]);
    setShowResults(false);
  }, []);

  const handleUploadAnother = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const currentStatus = hasFailed
    ? "failed"
    : currentStep >= statusProgression.length
    ? "ready"
    : statusProgression[currentStep]?.status || "queued";

  const statusMessage =
    currentStep >= statusProgression.length
      ? "Processing complete!"
      : statusProgression[currentStep]?.message || "Queued for processing...";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

            <Button variant="ghost" onClick={handleUploadAnother} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Upload
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {showResults ? "Your Notes are Ready!" : "Processing Your PDF"}
          </h1>
          <p className="text-muted-foreground">
            {showResults
              ? "Explore your structured notes, summary, and flashcards below."
              : "We're analyzing your document and generating study materials."}
          </p>
        </motion.div>

        {/* Job Status Card - always visible until results */}
        {!showResults && (
          <JobStatusCard
            fileName={fileName}
            status={currentStatus}
            statusMessage={statusMessage}
            logs={logs}
            errorMessage={hasFailed ? "Failed to process PDF. Please try again." : undefined}
            onRetry={handleRetry}
            onUploadAnother={handleUploadAnother}
          />
        )}

        {/* Results */}
        {showResults && (
          <ResultsTabs
            notes={mockNotes}
            summary={mockSummary}
            flashcards={mockFlashcards}
            onUploadAnother={handleUploadAnother}
          />
        )}
      </main>
    </div>
  );
}
