import "../index.css";
import { QueryProvider } from "@/components/providers/query-provider";

export const metadata = {
  title: "MemorizeAI",
  description: "Ask questions on a PDF and get answers with cited pages"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
