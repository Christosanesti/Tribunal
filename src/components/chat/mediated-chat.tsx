"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChat } from "@/hooks/use-chat";
import { MessageCircle, Send, AlertCircle } from "lucide-react";
import type { MessageCategory, CreateMessageInput } from "@/types";

const categoryIcons: Record<MessageCategory, React.ReactNode> = {
  general: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01M8 8h.01M12 8h.01M16 8h.01" />
    </svg>
  ),
  proposal: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  counter_proposal: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  complaint: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  response: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  ai_suggestion: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M9 12l2.5-2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  system: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 4h.01" />
    </svg>
  ),
};

export function MediatedChat({
  caseId,
  userId,
  userName,
  userRole,
}: {
  caseId: string;
  userId: string;
  userName: string;
  userRole: string;
}) {
  const {
    messages,
    isLoading,
    error,
    isSending,
    newMessage,
    setNewMessage,
    sendMessage,
    markAsRead,
  } = useChat({ caseId, userId });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<{ content: string; category: MessageCategory }>({
    defaultValues: {
      content: "",
      category: "general",
    },
  });

  const category = watch("category");

  const onSubmit = async (data: { content: string; category: MessageCategory }) => {
    if (!data.content.trim() || isSending) return;

    try {
      await sendMessage({
        content: data.content.trim(),
        category: data.category,
      });
      reset();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const typing = messages.length > 0 && messages[messages.length - 1]?.isOwn === false;

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              No messages yet. Start the conversation by sending a message
              below.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.isOwn ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                  message.isOwn
                    ? "bg-primary text-primary-foreground"
                    : message.senderRole === "mediator"
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {message.senderName?.charAt(0) || "?"}
              </div>

              {/* Message bubble */}
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2.5",
                  message.isOwn
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : message.category === "ai_suggestion" ||
                      message.category === "system"
                    ? "bg-muted text-muted-foreground rounded-br-sm border-l-2 border-primary"
                    : "bg-muted text-foreground rounded-br-sm"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium opacity-70">
                    {message.senderName}
                  </span>
                  <span className="text-xs opacity-50">
                    {message.senderRole}
                  </span>
                  {!message.isOwn && (
                    <span className="ml-auto flex items-center gap-1 text-xs opacity-50">
                      {categoryIcons[message.category]}
                      {message.category !== "general" &&
                        message.category !== "system" &&
                        message.category !== "ai_suggestion"}
                    </span>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className="mt-1 text-xs opacity-50">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {typing && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              {/* AI avatar */}
            </div>
            <div className="bg-muted rounded-2xl rounded-br-sm px-4 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              className="min-h-[80px] resize-none"
              {...register("content", {
                required: "Message is required",
                maxLength: {
                  value: 10000,
                  message: "Message must be under 10000 characters",
                },
              })}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                setValue("content", e.target.value);
              }}
            />
          </div>

          {/* Category selector */}
          <div className="flex gap-2">
            <Select
              value={category}
              onValueChange={(value: any) => {
                setValue("category", value as MessageCategory);
              }}
            >
              <SelectTrigger className="w-[180px] shrink-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="counter_proposal">Counter Proposal</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="response">Response</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="shrink-0"
            >
              {isSending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send
                </span>
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
