"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useSlideStore } from "@/store/useSlideStore";
import { generateAISlide, type AISlideKind } from "@/actions/ai";
import type { Slide } from "@/lib/types";

const SLIDE_KIND_OPTIONS: { value: AISlideKind; label: string }[] = [
  { value: "hero", label: "Hero" },
  { value: "titleBody", label: "Content (title + body)" },
  { value: "twoColumn", label: "Two-column comparison" },
  { value: "threeColumn", label: "Three-column comparison" },
  { value: "imageLeft", label: "Image left" },
  { value: "imageRight", label: "Image right" },
  { value: "imageGrid", label: "Image grid" },
  { value: "quote", label: "Quote" },
  { value: "stats", label: "Statistics" },
  { value: "fullImage", label: "Full-bleed image" },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AISlideModal: React.FC<Props> = ({ open, onOpenChange }) => {
  const { project, currentSlide, addSlideAtIndex, setCurrentSlide } = useSlideStore();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [kind, setKind] = useState<AISlideKind>("titleBody");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setTitle("");
    setTopic("");
    setKind("titleBody");
  };

  const handleGenerate = async () => {
    if (!project) {
      toast.error("No project loaded");
      return;
    }
    if (!topic.trim()) {
      toast.error("Topic is required");
      return;
    }
    setBusy(true);
    try {
      const insertAt = currentSlide + 1;
      const res = await generateAISlide(
        project.id,
        kind,
        title.trim(),
        topic.trim(),
        insertAt
      );
      if (res.status !== 200 || !res.data) {
        toast.error(res.error ?? "AI slide generation failed");
        return;
      }
      addSlideAtIndex(res.data as Slide, insertAt);
      setCurrentSlide(insertAt);
      toast.success("AI slide added");
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("AI slide generation failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !busy && onOpenChange(o)}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-blue-500" />
            Generate AI slide
          </DialogTitle>
          <DialogDescription>
            Pick a layout, give it a topic, and the AI fills it in using your
            presentation design system.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="ai-slide-title">Slide title (optional)</Label>
            <Input
              id="ai-slide-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 product highlights"
              disabled={busy}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="ai-slide-topic">Topic / prompt</Label>
            <Textarea
              id="ai-slide-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe what this slide should cover…"
              rows={3}
              disabled={busy}
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Slide type</Label>
            <Select
              value={kind}
              onValueChange={(v) => setKind(v as AISlideKind)}
              disabled={busy}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SLIDE_KIND_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={busy || !topic.trim()}>
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate slide
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AISlideModal;
