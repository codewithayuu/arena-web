"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { SPRING_DEFAULT } from "@/components/smoothui/lib/animation";

export interface SwitchProps {
  /** Accessible name, for switches without a visible `<label>` */
  "aria-label"?: string;
  /** ID of the element labelling the switch */
  "aria-labelledby"?: string;
  /** Whether the switch is checked (controlled) */
  checked?: boolean;
  /** Optional CSS class */
  className?: string;
  /** Whether the switch is initially checked (uncontrolled) */
  defaultChecked?: boolean;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** ID for label association */
  id?: string;
  /** Name attribute for form submission */
  name?: string;
  /** Callback when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Whether the switch is required */
  required?: boolean;
  /** Value attribute for form submission */
  value?: string;
}

const MotionThumb = motion.span;

const THUMB_OFF = "translateX(2px)";
const THUMB_ON = "translateX(18px)";

/**
 * SmoothUI Switch — Base UI primitive with spring animation.
 * Features controlled and uncontrolled modes, disabled state, and label association via `id`.
 */
export default function Switch({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  checked,
  className,
  defaultChecked = false,
  disabled = false,
  id,
  name,
  onCheckedChange,
  required,
  value,
}: SwitchProps) {
  const shouldReduceMotion = useReducedMotion();
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const isOn = checked ?? uncontrolledChecked;

  return (
    <SwitchPrimitive.Root
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      checked={isOn}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#e83040]/50 disabled:cursor-not-allowed disabled:opacity-40",
        disabled
          ? isOn
            ? "bg-zinc-600"
            : "bg-zinc-800"
          : isOn
            ? "bg-[#e83040]"
            : "bg-zinc-700 hover:bg-zinc-600 border-white/10",
        className
      )}
      data-slot="switch"
      disabled={disabled}
      id={id}
      name={name}
      nativeButton
      onCheckedChange={(next) => {
        if (checked === undefined) {
          setUncontrolledChecked(next);
        }
        onCheckedChange?.(next);
      }}
      render={<button type="button" />}
      required={required}
      value={value}
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block"
        data-slot="switch-thumb"
        render={
          <MotionThumb
            animate={{
              transform: isOn ? THUMB_ON : THUMB_OFF,
            }}
            className={cn(
              "pointer-events-none block size-4 rounded-full shadow-md ring-0",
              disabled ? "bg-zinc-400" : "bg-white"
            )}
            transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
          />
        }
      />
    </SwitchPrimitive.Root>
  );
}
