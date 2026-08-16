import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";

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
  const [websiteUrl, setWebsiteUrl] = useState(""); // Honeypot field for bot protection
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/submit-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, labels, websiteUrl }),
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: text || "Server returned an invalid response." };
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error (${response.status})`);
      }

      setSuccessUrl(data.html_url);
    } catch (err: any) {
      setError(err.message || "Something went wrong while submitting to GitHub.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessUrl(null);
    setError(null);
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

        {successUrl ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">Request Successfully Submitted!</h3>
            <p className="text-sm text-muted-foreground">
              Your suggestion or report has been posted to GitHub as a tracked issue. The project owner will review the research needed.
            </p>
            <div>
              <a
                href={successUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
              >
                View Created GitHub Issue <ExternalLink className="h-4 w-4" />
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
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-900 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Hidden honeypot field for bot protection */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="websiteUrl">Website</label>
              <input
                type="text"
                id="websiteUrl"
                name="websiteUrl"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

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
                Submit to GitHub
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
