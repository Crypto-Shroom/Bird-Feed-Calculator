import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Send } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { parseIssueCreationResponse } from "@/lib/issue-submission";

interface IssueSubmitDialogProps {
  triggerLabel: React.ReactNode;
  triggerClassName?: string;
  defaultTitle: string;
  defaultBody: string;
  labels?: string[];
  helperText?: string;
}

type SubmissionMode = "created" | "queued" | "fallback" | null;

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
  const [error, setError] = useState<string | null>(null);
  const [submissionMode, setSubmissionMode] = useState<SubmissionMode>(null);
  const [githubUrl, setGithubUrl] = useState<string | null>(null);

  const getGitHubIssueUrl = () => {
    const query = new URLSearchParams({
      title,
      body: `${body}\n\n---\n*Submitted via Pigeon Seed Mix Calculator in-app assistant.*`,
    });
    if (labels.length) query.set("labels", labels.join(","));
    return `https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/new?${query.toString()}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const directGithubUrl = getGitHubIssueUrl();

    try {
      const response = await fetch("/api/submit-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, labels }),
      });
      const text = await response.text();
      const data = parseIssueCreationResponse({
        ok: response.ok,
        status: response.status,
        contentType: response.headers.get("content-type"),
        body: text,
      });

      setGithubUrl(data.html_url);
      setSubmissionMode("created");
      return;
    } catch {
      // Firebase Hosting on Spark does not run the Express endpoint. In that
      // case, keep the visitor in-app and use the Firestore review queue.
    }

    try {
      await addDoc(collection(db, "reports"), {
        title,
        body,
        labels,
        status: "new",
        createdAt: serverTimestamp(),
      });
      setGithubUrl(directGithubUrl);
      setSubmissionMode("queued");
    } catch {
      // The direct GitHub link is a non-blocking last resort for offline or
      // blocked Firestore clients; it never redirects the visitor automatically.
      setGithubUrl(directGithubUrl);
      setSubmissionMode("fallback");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmissionMode(null);
    setGithubUrl(null);
    setError(null);
    setOpen(false);
  };

  const successCopy = submissionMode === "created"
    ? "Your suggestion or report has been created as a tracked GitHub issue."
    : submissionMode === "queued"
      ? "Your submission has been saved to the secure queue. It will be reviewed and converted to a GitHub issue during our once-daily processor run. You can also open it directly on GitHub immediately below."
      : "Your request is ready as a pre-filled GitHub issue. It was not submitted automatically because the in-app reporting service was unavailable.";

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
            Your report stays in the calculator.
          </DialogDescription>
        </DialogHeader>

        {submissionMode ? (
          <div className="space-y-4 py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">{submissionMode === "created" ? "Request Successfully Submitted" : submissionMode === "queued" ? "Request Queued Successfully" : "Request Prepared"}</h3>
            <p className="text-sm text-muted-foreground">{successCopy}</p>
            {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800">
              {submissionMode === "created" ? "View Created GitHub Issue" : "Open Pre-filled GitHub Issue"} <ExternalLink className="h-4 w-4" />
            </a>}
            <div className="pt-2"><Button type="button" variant="outline" onClick={handleReset}>Close</Button></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {error && <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900"><AlertCircle className="h-4 w-4 shrink-0 text-red-600" /><span>{error}</span></div>}
            <div className="space-y-2">
              <Label htmlFor="issue-title">Issue Title</Label>
              <Input id="issue-title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-body">Description & Research Notes</Label>
              <Textarea id="issue-body" rows={8} value={body} onChange={(event) => setBody(event.target.value)} required className="font-mono text-xs" />
            </div>
            {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading} className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
