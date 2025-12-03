import { useBuilder } from "@/hooks/use-builder";
import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StateViewer() {
  const { state } = useBuilder();
  const [copied, setCopied] = useState(false);

  const jsonString = useMemo(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
          title="Copy JSON"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="relative rounded-lg border bg-muted/50 overflow-hidden">
        <pre
          className={cn(
            "p-4 text-sm font-mono overflow-auto",
            "text-foreground/90",
            "scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent"
          )}
          style={{
            maxHeight: "70vh",
          }}
        >
          <code className="whitespace-pre-wrap wrap-break-word">{jsonString}</code>
        </pre>
      </div>
    </div>
  );
}

