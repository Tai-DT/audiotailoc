"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"

export interface NumberStepperProps {
  value: number
  min?: number
  onChange: (value: number) => void
  className?: string
  ariaLabel?: string
}

export const NumberStepper: React.FC<NumberStepperProps> = ({ value, min = 1, onChange, className = '', ariaLabel }) => {
  const handleDecrement = () => {
    onChange(Math.max(min, (value || min) - 1))
  }

  const handleIncrement = () => {
    onChange((value || min) + 1)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value)
    onChange(isNaN(v) ? min : Math.max(min, v))
  }

  return (
    <div className={`w-32 flex items-center space-x-2 ${className}`} aria-label={ariaLabel}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 bg-card border border-border text-foreground"
        aria-label="Decrease quantity"
        title="Giảm"
        onClick={handleDecrement}
      >
        <Minus className="w-4 h-4" />
      </Button>

      <Input
        type="number"
        min={min}
        value={value}
        onChange={handleInput}
        placeholder="1"
        className="text-center bg-card border border-border text-foreground focus-visible:ring-ring/50"
        aria-label={ariaLabel || 'Quantity input'}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 bg-card border border-border text-foreground"
        aria-label="Increase quantity"
        title="Tăng"
        onClick={handleIncrement}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default NumberStepper
