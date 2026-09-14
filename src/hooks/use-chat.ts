"use client";

import { useState, useCallback } from "react";
import type {
  MessageCategory,
  PaginatedResult,
  CreateMessageInput,
} from "@/types";

interface UseChatOptions {
  caseId: string;
  userId: string;
  onNewMessage?: (message: Message) => void;
  initialMessages?: Message[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  category: MessageCategory;
  createdAt: Date;
  isOwn: boolean;
  parentMessageId?: string | null;
}

export function useChat({
  caseId,
  userId,
  onNewMessage,
  initialMessages = [],
}: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const addMessage = useCallback(
    (message: Message) => {
      setMessages((prev) => [...prev, message]);
      onNewMessage?.(message);
    },
    [onNewMessage]
  );

  const sendMessage = useCallback(
    async (data: Omit<CreateMessageInput, "caseId" | "senderId">) => {
      setIsSending(true);
      setError(null);

      try {
        const response = await fetch(`/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            caseId,
            senderId: userId,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to send message");
        }

        const result = await response.json();
        const message: Message = {
          id: result.id,
          content: data.content,
          senderId: userId,
          senderName: result.senderName,
          senderRole: result.senderRole,
          category: data.category || "general",
          createdAt: new Date(result.createdAt),
          isOwn: true,
          parentMessageId: data.parentMessageId,
        };

        addMessage(message);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [caseId, userId, addMessage]
  );

  const replyToMessage = useCallback(
    async (
      parentMessageId: string,
      content: string,
      category: MessageCategory = "response"
    ) => {
      return sendMessage({ content, category, parentMessageId });
    },
    [sendMessage]
  );

  const markAsRead = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/chat/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId }),
      });
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  return {
    messages,
    isLoading,
    error,
    newMessage,
    isSending,
    setNewMessage,
    sendMessage,
    replyToMessage,
    markAsRead,
    addMessage,
  };
}
