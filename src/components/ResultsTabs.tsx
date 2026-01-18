import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, AlignLeft, Lightbulb, Copy, Download, Upload, Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { NotesView } from "@/components/NotesView";
import { SummaryView } from "@/components/SummaryView";
import { FlashcardsView } from "@/components/FlashcardsView";
import { toast } from "sonner";

interface ResultsTabsProps {
  notes: string;
  summary: string;
  flashcards: Array<{ id: string; question: string; answer: string }>;
  onUploadAnother: () => void;
}

export function ResultsTabs({ notes, summary, flashcards, onUploadAnother }: ResultsTabsProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("notes");

  const handleCopy = async () => {
    let content = "";
    if (activeTab === "notes") content = notes;
    if (activeTab === "summary") content = summary;
    if (activeTab === "flashcards") {
      content = flashcards
        .map((f, i) => `Q${i + 1}: ${f.question}\nA: ${f.answer}`)
        .join("\n\n");
    }

    await navigator.clipboard.writeText(content);
    setCopiedTab(activeTab);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDownload = () => {
    let content = "";
    let filename = "";
    
    if (activeTab === "notes") {
      content = notes;
      filename = "notes.md";
    }
    if (activeTab === "summary") {
      content = summary;
      filename = "summary.md";
    }
    if (activeTab === "flashcards") {
      content = flashcards
        .map((f, i) => `## Question ${i + 1}\n${f.question}\n\n**Answer:** ${f.answer}`)
        .join("\n\n---\n\n");
      filename = "flashcards.md";
    }

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated overflow-hidden"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-border px-6 pt-4">
          <TabsList className="h-auto p-0 bg-transparent gap-6">
            <TabsTrigger
              value="notes"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none pb-3 px-0"
            >
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none pb-3 px-0"
            >
              <AlignLeft className="w-4 h-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="flashcards"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none pb-3 px-0"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Flashcards
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="notes" className="mt-0">
            <NotesView content={notes} />
          </TabsContent>
          <TabsContent value="summary" className="mt-0">
            <SummaryView content={summary} />
          </TabsContent>
          <TabsContent value="flashcards" className="mt-0">
            <FlashcardsView flashcards={flashcards} />
          </TabsContent>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-border px-6 py-4 bg-muted/30">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleCopy}>
              {copiedTab === activeTab ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copiedTab === activeTab ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download as Markdown
            </Button>
            <Button onClick={onUploadAnother} className="ml-auto">
              <Upload className="w-4 h-4 mr-2" />
              Upload Another PDF
            </Button>
          </div>
        </div>
      </Tabs>
    </motion.div>
  );
}
