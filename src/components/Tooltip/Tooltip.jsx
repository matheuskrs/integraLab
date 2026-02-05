import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import "./tooltip.css";

export default function Tooltip({ content, children, disabled }) {
  const isMobile = useMediaQuery("(max-width:700px)");
  const [open, setOpen] = useState(false);

  if (disabled) return children;

  return (
    <TooltipPrimitive.Root delayDuration={200} disableHoverableContent open={isMobile ? open : undefined} onOpenChange={isMobile ? setOpen : undefined} >
      <TooltipPrimitive.Trigger asChild>
        <span
          onClick={(e) => {
            if (!isMobile) return;
            e.preventDefault();
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
        >
          {children}
        </span>
      </TooltipPrimitive.Trigger>

      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={isMobile ? "top" : "right"}
          className="radix-tooltip-content"
        >
          {content}
          <TooltipPrimitive.Arrow className="radix-tooltip-arrow" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
