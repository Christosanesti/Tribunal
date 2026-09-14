"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export const Select = ({ value, onValueChange, children }: any) => {
  return <div data-select-value={value}>{React.Children.map(children, c=> c ? React.cloneElement(c as any, { selectValue: value, onValueChange }) : null)}</div>;
};
export const SelectTrigger = React.forwardRef<HTMLButtonElement, any>(({ children, className, selectValue, onValueChange, ...props }, ref) => (
  <div className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm", className)}>{children}</div>
));
SelectTrigger.displayName="SelectTrigger";
export const SelectValue = ({ placeholder, children }: any) => <span>{children || placeholder}</span>;
export const SelectContent = ({ children, selectValue, onValueChange }: any) => (
  <div className="mt-1 rounded-md border bg-popover p-1 shadow-md space-y-0.5">{React.Children.map(children, c=> c ? React.cloneElement(c as any, { selectValue, onValueChange }) : null)}</div>
);
export const SelectItem = React.forwardRef<HTMLDivElement, any>(({ children, value, selectValue, onValueChange, className, ...props }, ref) => {
  const selected = value===selectValue;
  return <div ref={ref as any} onClick={()=> onValueChange?.(value)} className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground", selected&&"bg-accent", className)}>{selected && <Check className="mr-2 h-4 w-4"/>}{children}</div>;
});
SelectItem.displayName="SelectItem";
