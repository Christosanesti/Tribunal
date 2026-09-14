"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export const Form = ({ children, ...props }: any) => <form {...props}>{children}</form>;
export const FormItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("space-y-2", className)} {...props} />;
export const FormLabel = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => <Label className={cn(className)} {...props} />;
export const FormControl = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const FormMessage = ({ children, className }: { children?: React.ReactNode; className?: string }) => children ? <p className={cn("text-sm font-medium text-destructive", className)}>{children}</p> : null;
export const FormField = ({ render, name }: any) => render({ field: { name, value: "", onChange: ()=>{} } });
export const FormDescription = ({ children, className }: any) => <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
