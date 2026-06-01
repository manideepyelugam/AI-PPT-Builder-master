import { cn } from "@/lib/utils";
import React from "react";

type CodeBlockProps = {
  code?: string;
  language?: string;
  className?: string;
  isEditable?: boolean;
  onChange: (newCode: string) => void;
};

const CodeBlock = ({ className, code, language, isEditable = true, onChange }: CodeBlockProps) => {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-[var(--slide-radius-md)] p-[var(--slide-space-4)] bg-[color:var(--slide-surface)] border border-[color:var(--slide-border)]",
        className
      )}
    >
      <code className={`language-${language}`}>
        <textarea
          value={code}
          readOnly={!isEditable}
          onChange={(e) => isEditable && onChange(e.target.value)}
          className="size-full bg-transparent font-mono text-[color:var(--slide-fg)] outline-none"
        />
      </code>
    </pre>
  );
};

export default CodeBlock;
