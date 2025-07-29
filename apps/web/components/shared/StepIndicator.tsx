import { cn } from "@/lib/utils";
import { Check, Loader, Loader2 } from "lucide-react";

interface StepIndicatorProps {
  status: "done" | "ongoing" | "pending";
}

export function StepIndicator({ status }: StepIndicatorProps) {
  return (
    <div
      className={cn(
        "h-5 w-5  flex items-center justify-center rounded-full border-2 text-center text-[11px]/5",
        status === "done" && "border-0 bg-green-400 text-white ",
        status === "ongoing" && " border-0 ",
        status === "pending" && "border-muted-foreground"
      )}
    >
      {status === "done" && <Check className="h-3 w-3" />}
      {status === "ongoing" && <Loader className="h-5 w-5  text-primary" />}
    </div>
  );
}
