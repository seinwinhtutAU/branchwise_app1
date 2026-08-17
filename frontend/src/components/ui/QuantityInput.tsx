import React from "react";
import { Minus, Plus } from "lucide-react";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantityInput({ value, onChange, min = 0, max, disabled }: QuantityInputProps) {
  function clamp(n: number) {
    let v = n;
    if (min != null) v = Math.max(min, v);
    if (max != null) v = Math.min(max, v);
    return v;
  }

  return (
    <div className="inline-flex h-8 items-center rounded-md border border-neutral-200 bg-white">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className="flex h-full w-7 items-center justify-center text-neutral-500 hover:bg-neutral-50 disabled:opacity-30"
      >
        <Minus className="h-3 w-3" />
      </button>
      <input
        type="number"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
        className="h-full w-12 border-x border-neutral-200 text-center text-sm [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        disabled={disabled || (max != null && value >= max)}
        onClick={() => onChange(clamp(value + 1))}
        className="flex h-full w-7 items-center justify-center text-neutral-500 hover:bg-neutral-50 disabled:opacity-30"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
