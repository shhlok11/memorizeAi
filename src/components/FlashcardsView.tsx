import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  chunkId?: string;
  pageStart?: number | null;
  pageEnd?: number | null;
  snippet?: string;
}

interface FlashcardsViewProps {
  flashcards: Flashcard[];
}

function FlashcardItem({ flashcard, index }: { flashcard: Flashcard; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-elevated overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex-1">
          <span className="text-xs font-medium text-primary mb-1 block">
            Question {index + 1}
          </span>
          <p className="font-medium text-foreground">{flashcard.question}</p>
        </div>
        <div className="flex-shrink-0 mt-1">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>
      
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 pt-0">
          <div className="border-t border-border pt-4">
            <span className="text-xs font-medium text-success mb-1 block">
              Answer
            </span>
            <p className="text-foreground leading-relaxed">{flashcard.answer}</p>
            {flashcard.snippet ? (
              <div className="mt-3 text-xs text-muted-foreground">
                <p className="font-mono text-foreground">
                  {flashcard.chunkId ?? "source"} (pages {flashcard.pageStart ?? "?"}-{flashcard.pageEnd ?? "?"})
                </p>
                <p className="mt-1">{flashcard.snippet}</p>
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FlashcardsView({ flashcards }: FlashcardsViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {flashcards.map((flashcard, index) => (
        <FlashcardItem key={flashcard.id} flashcard={flashcard} index={index} />
      ))}
    </motion.div>
  );
}
