import { FileText } from "lucide-react";
import { Citation } from "@/lib/rag/types";

export function SourceCard({ citation, index }: { citation: Citation; index?: number }) {
  const title = citation.title || citation.filename || "Community Document";
  return (
    <div className="flex max-w-full items-center gap-2 rounded-lg border border-[#0B4D36]/10 bg-white px-2.5 py-1.5 shadow-sm">
      {index ? (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#0B4D36]/10 text-[10.5px] font-bold text-[#0B4D36]">{index}</span>
      ) : (
        <FileText size={14} className="shrink-0 text-[#0B4D36]" />
      )}
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[12px] font-semibold text-gray-800">{title}</p>
        {citation.section && <p className="truncate text-[10.5px] text-gray-500">{citation.section}</p>}
      </div>
    </div>
  );
}
