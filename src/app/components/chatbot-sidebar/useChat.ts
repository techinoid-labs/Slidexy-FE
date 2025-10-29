"use client";
import { useEffect, useState, useRef } from "react";
import { useUser } from "../../context/AuthContext";

export interface Message {
  sender: "user" | "bot";
  text: string;
}

export function useChat() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ✅ Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Fetch chat history for logged-in users
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user?.email) return;

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
        const res = await fetch(`${baseUrl}/api/chat/history/${user.email}`);
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    fetchChatHistory();
  }, [user]);

  // ✅ Send new message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          user: user ? { name: user.name, email: user.email } : null,
        }),
      });

      const data = await res.json();
      const botReply: Message = {
        sender: "bot",
        text: data.response || "I'm not sure how to respond to that.",
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Unable to connect to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, input, setInput, loading, sendMessage, chatEndRef };
}