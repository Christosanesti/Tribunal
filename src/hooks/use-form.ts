"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import type { z } from "zod";
export function useValidatedForm<T extends ZodType<any, any, any>>(schema: T, options?: any) {
  return useForm<z.infer<T>>({ resolver: zodResolver(schema as any), ...options });
}
