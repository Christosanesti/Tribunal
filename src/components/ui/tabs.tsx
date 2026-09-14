"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
const TabsContext = React.createContext<{ value: string; onChange: (v:string)=>void }>({ value: "", onChange: ()=>{} });
export function Tabs({ defaultValue, value, onValueChange, children, className }: any) {
  const [internal, setInternal] = React.useState(defaultValue || "");
  const v = value ?? internal;
  const onChange = onValueChange ?? setInternal;
  return <TabsContext.Provider value={{ value: v, onChange }}><div className={cn(className)}>{children}</div></TabsContext.Provider>;
}
export function TabsList({ children, className }: any) {
  return <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>{children}</div>;
}
export function TabsTrigger({ value, children, className }: any) {
  const ctx = React.useContext(TabsContext);
  const active = ctx.value===value;
  return <button onClick={()=>ctx.onChange(value)} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all", active&&"bg-background text-foreground shadow-sm", className)}>{children}</button>;
}
export function TabsContent({ value, children, className }: any) {
  const ctx = React.useContext(TabsContext);
  if (ctx.value!==value) return null;
  return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none", className)}>{children}</div>;
}
