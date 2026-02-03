import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import "./tooltip.css";
export default function Tooltip({ content, children, disabled }) {
  if (disabled) return children;

  return (
    <TooltipPrimitive.Root delayDuration={200} disableHoverableContent>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>

      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="right"
          className="radix-tooltip-content"
        >
          {content}
          <TooltipPrimitive.Arrow className="radix-tooltip-arrow" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
