import { motion } from "framer-motion";

interface NotesViewProps {
  content: string;
}

export function NotesView({ content }: NotesViewProps) {
  // Parse content into sections (in real app, this would come structured from backend)
  const sections = content.split("\n\n").filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="prose prose-slate max-w-none"
    >
      {sections.map((section, index) => {
        const isHeading = section.startsWith("#");
        
        if (isHeading) {
          const level = section.match(/^#+/)?.[0].length || 1;
          const text = section.replace(/^#+\s*/, "");
          
          if (level === 1) {
            return (
              <h1 key={index} className="text-2xl font-bold text-foreground mt-6 mb-4 first:mt-0">
                {text}
              </h1>
            );
          }
          if (level === 2) {
            return (
              <h2 key={index} className="text-xl font-semibold text-foreground mt-5 mb-3">
                {text}
              </h2>
            );
          }
          return (
            <h3 key={index} className="text-lg font-medium text-foreground mt-4 mb-2">
              {text}
            </h3>
          );
        }

        // Check if it's a bullet list
        if (section.includes("• ") || section.includes("- ")) {
          const items = section.split(/\n/).filter(item => item.trim());
          return (
            <ul key={index} className="list-disc pl-5 space-y-2 my-4">
              {items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-foreground leading-relaxed">
                  {item.replace(/^[•\-]\s*/, "")}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="text-foreground leading-relaxed my-4">
            {section}
          </p>
        );
      })}
    </motion.div>
  );
}
