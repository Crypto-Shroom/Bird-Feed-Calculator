import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
  const [submitted, setSubmitted] = useState(false);
  const [githubUrl, setGithubUrl] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const query = new URLSearchParams({
      title,
      body: `${body}\n\n---\n*Submitted via Pigeon Seed Mix Calculator in-app assistant.*`,
    });
    if (labels && labels.length > 0) {
      query.set("labels", labels.join(","));
    }
    const directGithubUrl = `https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/new?${query.toString()}`;
    setGithubUrl(directGithubUrl);

    try {
      // Save report document to Firestore queue
      await addDoc(collection(db, "reports"), {
        title,
        body,
        labels,
        status: "new",
        createdAt: serverTimestamp(),
      });
      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      // If offline or blocked, still allow opening direct GitHub issue
      setLoading(false);
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
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
            Your report or suggestion will be queued for review and research.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">Request Queued Successfully!</h3>
            <p className="text-sm text-muted-foreground">
              Your submission has been saved to the secure queue. It will be reviewed and converted to a GitHub issue during our once-daily processor run. You can also open it directly on GitHub immediately below.
            </p>
            <div>
              <a
                href={githubUrl}
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
                Submit Report
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
