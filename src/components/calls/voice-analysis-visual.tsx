import { AudioLines } from "lucide-react";
import { VisualPlaceholder } from "@/components/shared/visual-placeholder";

/** Voice Analysis visual for the Live Call Analysis page. See VisualPlaceholder for swap-in instructions. */
export function VoiceAnalysisVisual({ className }: { className?: string }) {
  return <VisualPlaceholder icon={AudioLines} label="Voice analysis visual" height={220} className={className} />;
}
