import * as React from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  id: string;
  accept?: string;
  label?: string;
  hint?: string;
  file?: File | null;
  onFileChange: (file: File | null) => void;
}

export function Dropzone({ id, accept, label = 'Upload file', hint, file, onFileChange }: DropzoneProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <input
        id={id}
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "w-full h-32 rounded-vj-large border-2 border-dashed border-vj-border bg-[hsl(var(--card))] text-[hsl(var(--text-muted))] flex flex-col items-center justify-center gap-2 hover:shadow-[var(--vj-shadow-subtle)] transition",
        )}
      >
        <Upload className="w-6 h-6" />
        {file ? (
          <div className="text-sm">✓ {file.name}</div>
        ) : (
          <div className="text-sm">{label}</div>
        )}
        {hint && <div className="text-xs text-[hsl(var(--text-muted))]">{hint}</div>}
      </button>
    </div>
  );
}

export default Dropzone;
