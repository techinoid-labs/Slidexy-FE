"use client";
import { useEffect, useState, useRef } from "react";
import { useUser } from "../../context/AuthContext";
import  GenerateSlide  from "./GenerateSlide";

export interface Message {
  sender: "user" | "bot";
  text: string;
  agentMode?: boolean;
}

export function useChat() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("");
  const [style, setStyle] = useState("");
  const [agentStep, setAgentStep] = useState<"topic" | "tone" | "style" | null>(null);


  // ✅ Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const toggleAgentMode = () => {
  setIsAgentActive((prev) => {
    const newState = !prev;
    if (newState) {
      setTopic("");
      setTone("");
      setStyle("");
      setAgentStep("topic"); 
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Agent mode activated. What is the topic of your slides?", agentMode: true }
      ]);
    } else {
      setAgentStep(null);
    }
    return newState;
  });
};

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

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg: Message = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setLoading(true);

  try {
    // If agent mode active and some step is pending
    if (isAgentActive && agentStep) {
      switch (agentStep) {
        case "topic":
          setTopic(input);
          setAgentStep("tone");
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "Got it! What tone should the slides have?", agentMode: true }
          ]);
          break;

        case "tone":
          setTone(input);
          setAgentStep("style");
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "Great! Finally, what visual style do you want?", agentMode: true }
          ]);
          break;

        case "style":
          setStyle(input);
          setAgentStep(null); // All fields filled
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "Perfect! Generating your slides now...", agentMode: true }
          ]);

          break;
      }

      setLoading(false);
      return;
    }

    // Normal chat behavior
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
      agentMode: isAgentActive
    };
    setMessages((prev) => [...prev, botReply]);
  } catch (error) {
    console.error("Chat error:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "⚠️ Unable to connect to server.", agentMode: isAgentActive },
    ]);
  } finally {
    setLoading(false);
  }
};

  return { messages, input, setInput, loading, sendMessage, chatEndRef, toggleAgentMode, isAgentActive,tone,topic,style };
}