import { FlaskConicalOffIcon } from "lucide-react";
import React from "react";

const NotFound = () => {
  return (
    <div className="border-border bg-card/50 flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 rounded-2xl border border-dashed px-6 py-16">
      <div className="bg-muted text-muted-foreground flex size-16 items-center justify-center rounded-full">
        <FlaskConicalOffIcon className="size-8" />
      </div>
      <div className="flex max-w-md flex-col items-center text-center">
        <p className="text-foreground text-xl font-semibold tracking-tight">
          Nothing here yet
        </p>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Start by creating your first presentation with{" "}
          <span className="text-foreground font-medium">Creative AI</span> or a
          template.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
