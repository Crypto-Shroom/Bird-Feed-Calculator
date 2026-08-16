import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, ExternalLink } from "lucide-react";

interface IssueSubmitDialogProps {
  triggerLabel: React.ReactNode;
  triggerClassName?: string;
  defaultTitle: string;
  defaultBody: string;
  labels?: string[];
  helperText?: string;
}

export function IssueSubmitDialog({
  triggerLabel,
  triggerClassName,
  defaultTitle,
  defaultBody,
  labels = ["needs-research"],
  helperText,
}: IssueSubmitDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [body, setBody] = useState(defaultBody);
  const [loading, setLoading] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Build direct GitHub new-issue URL immediately for robust static / Spark hosting reliability
    const query = new URLSearchParams({
      title,
      body: `${body}\n\n---\n*Submitted via Pigeon Seed Mix Calculator in-app assistant.*`,
    });
    if (labels && labels.length > 0) {
      query.set("labels", labels.join(","));
    }
    const directGithubUrl = `https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/new?${query.toString()}`;

    // Simulate short network tick then present direct GitHub issue action
    setTimeout(() => {
      setFallbackUrl(directGithubUrl);
      setLoading(false);
    }, 400);
  };

  const handleReset = () => {
    setFallbackUrl(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={triggerClassName || "inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"}>
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Submit Request to Project Owner</DialogTitle>
          <DialogDescription>
            This will create a research request directly in the repository without leaving the calculator.
          </DialogDescription>
        </DialogHeader>

        {fallbackUrl ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">Ready to Post to GitHub</h3>
            <p className="text-sm text-muted-foreground">
              Click below to open your pre-filled issue directly on GitHub in one click. All notes and context are already attached.
            </p>
            <div>
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
              >
                Open Pre-filled GitHub Issue <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="pt-2">
              <Button type="button" variant="outline" onClick={handleReset}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="issue-title">Issue Title</Label>
              <Input
                id="issue-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue-body">Description & Research Notes</Label>
              <Textarea
                id="issue-body"
                rows={7}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue to GitHub
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
