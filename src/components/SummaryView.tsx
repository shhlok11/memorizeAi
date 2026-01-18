import { motion } from "framer-motion";

interface SummaryViewProps {
  content: string;
}

export function SummaryView({ content }: SummaryViewProps) {
  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => {
          // Check for key takeaways or highlights
          const isHighlight = paragraph.startsWith("**") || paragraph.startsWith("Key:");
          
          return (
            <p
              key={index}
              className={
                isHighlight
                  ? "text-foreground font-medium leading-relaxed bg-primary/5 p-4 rounded-lg border-l-4 border-primary"
                  : "text-foreground leading-relaxed"
              }
            >
              {paragraph.replace(/^\*\*|\*\*$/g, "").replace(/^Key:\s*/, "")}
            </p>
          );
        })}
      </div>
    </motion.div>
  );
}
