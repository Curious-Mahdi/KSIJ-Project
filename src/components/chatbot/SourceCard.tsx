import { Citation } from "@/lib/rag/types";
import { BookOpen } from "lucide-react";

export function SourceCard({ citation }: { citation: Citation }) {
  return (
    <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-gray-50 text-xs">
      <BookOpen size={14} className="text-blue-500" />
      <div className="flex flex-col">
        <span className="font-semibold">{citation.title || citation.filename || "Community Document"}</span>
        {citation.section && <span className="text-gray-500">{citation.section}</span>}
      </div>
    </div>
  );
}
