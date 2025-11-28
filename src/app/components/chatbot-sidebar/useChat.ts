"use client";
import { useEffect, useState, useRef } from "react";
import { useUser } from "../../context/AuthContext";

export interface Message {
  sender: "user" | "bot";
  text: string;
  agentMode?: boolean;
}

const ALLOWED_TONES = ["professional", "casual", "inspirational"];

const TEXT_ART_STYLES = [
  "Concept Art",
  "3D Render / CGI",
  "Watercolor Illustration",
  "AI Collage / Mixed Media",
  "Digital Painting",
  "Fantasy / Sci-Fi Style",
  "Minimal Abstract",
];

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
  const [hasActivatedAgentOnce, setHasActivatedAgentOnce] = useState(false);

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
        if (!hasActivatedAgentOnce) {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "Agent mode activated. What is the topic of your slides?", agentMode: true }
          ]);
          setHasActivatedAgentOnce(true);
        }
      } else {
        setAgentStep(null);
      }
      return newState;
    });
  };

  const validateThroughAPI = async (value: string): Promise<boolean> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

      const res = await fetch(`${baseUrl}/api/chat/validator/topic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: value })
      });

      const data = await res.json();

      // API MUST return "yes" or "no" string
      return data.valid === "yes";
    } catch (err) {
      console.error("Validation failed:", err);
      return false;
    }
  };

  const validateTone = (value: string): boolean => {
    return ALLOWED_TONES.includes(value.trim().toLowerCase());
  };

  const validateStyle = (value: string): boolean => {
    return TEXT_ART_STYLES.includes(value.trim());
  };

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

  useEffect(() => {
    fetchChatHistory();
  }, [user]);

  const sendMessage = async (customInput?: string, isAuto?: boolean) => {
    const finalInput = isAuto ? customInput! : input;

    if (!finalInput.trim()) return;

    const userMsg: Message = { sender: "user", text: finalInput };
    setMessages((prev) => [...prev, userMsg]);
     if (!isAuto) setInput("");
    setLoading(true);

    try {
      // If agent mode active and some step is pending
      if (isAgentActive && agentStep) {
        switch (agentStep) {

          //----------------------------------
          // 1️⃣ TOPIC VALIDATION (via API)
          //----------------------------------
          case "topic": {
            const ok = await validateThroughAPI(finalInput);

            if (!ok) {
              setMessages((prev) => [
                ...prev,
                {
                  sender: "bot",
                  text: "❌ That doesn't seem like a valid topic. Please try again with a clear subject.",
                  agentMode: true
                }
              ]);
              setLoading(false);
              return;
            }

            setTopic(finalInput);
            setAgentStep("tone");

            setMessages((prev) => [
              ...prev,
              {
                sender: "bot",
                text: "Great! Now choose a tone: **professional**, **casual**, or **inspirational**.",
                agentMode: true
              },
              { sender: "bot", text: "__tone_options__", agentMode: true }
            ]);
            break;
          }

          //----------------------------------
          // 2️⃣ TONE VALIDATION (frontend-only)
          //----------------------------------
          case "tone": {
            if (!validateTone(finalInput)) {
              setMessages((prev) => [
                ...prev,
                {
                  sender: "bot",
                  text: `❌ Invalid tone. Allowed options are:\n- professional\n- casual\n- inspirational`,
                  agentMode: true
                }
              ]);
              setLoading(false);
              return;
            }

            setTone(finalInput);
            setAgentStep("style");

            setMessages((prev) => [
              ...prev,
              {
                sender: "bot",
                text: "Nice! Now choose a visual style:\n" + TEXT_ART_STYLES.map(s => `- ${s}`).join("\n"),
                agentMode: true
              },
              { sender: "bot", text: "__style_options__", agentMode: true }
            ]);
            break;
          }

          //----------------------------------
          // 3️⃣ STYLE VALIDATION (frontend-only)
          //----------------------------------
          case "style": {
            if (!validateStyle(finalInput)) {
              setMessages((prev) => [
                ...prev,
                {
                  sender: "bot",
                  text:
                    `❌ Invalid style. Here are the allowed styles:\n` +
                    TEXT_ART_STYLES.map(s => `- ${s}`).join("\n"),
                  agentMode: true
                }
              ]);
              setLoading(false);
              return;
            }

            setStyle(finalInput);
            setAgentStep(null); // all done

            setMessages((prev) => [
              ...prev,
              {
                sender: "bot",
                text: "Perfect! Generating your slides now...",
                agentMode: true
              }
            ]);
            break;
          }
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

  const autoAnswer = async (value: string) => {
  setInput(value);
  await sendMessage(value, true); // pass value directly
};

  return { messages, input, setInput, loading, sendMessage, chatEndRef, toggleAgentMode, isAgentActive, tone, topic, style,autoAnswer };
}