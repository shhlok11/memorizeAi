import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { ingestDocument } from "@/inngest/ingest-document";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [ingestDocument]
});
