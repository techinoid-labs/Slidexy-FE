"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type ActionPayload = {
  prompt?: string;
  goal?: string;
  tone?: string;
  visualStyle?: string;
  slideCount?: number;
  [key: string]: any;
};

type AgentCommand = {
  action: string;
  url?: string;
  payload?: ActionPayload;
  message?: string;
};

export type AgentMessageType = "message" | "activity" | "step" | "success" | "activity_header" | "screenshot" | "click" | "type_text" | "done";

export interface ChatMessage {
  sender: "user" | "agent";
  text: string;
  type?: AgentMessageType;
  stepsCount?: number;
}

interface AgentContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  handleUserMessage: (message: string) => Promise<void>;
  chatHistory: ChatMessage[];
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const router = useRouter();

  const handleUserMessage = async (message: string) => {
    setChatHistory((prev) => [...prev, { sender: "user", text: message, type: "message" }]);
    setIsProcessing(true);

    try {
      // 1. Call Backend to parse intent
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/agent/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           message,
           currentPath: window.location.pathname
        }),
      });

      const data: AgentCommand = await res.json();

      if (data.message) {
         setChatHistory((prev) => [...prev, { sender: "agent", text: data.message!, type: "message" }]);
      } else {
         setChatHistory((prev) => [...prev, { sender: "agent", text: "Processing your request...", type: "message" }]);
      }

      // Step-by-step progress logging for transparency
      const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
      
      // 2. Execute Action
      if (data.action === "edit_outline") {
        if (!window.location.pathname.includes("/presentation/outline")) {
            setChatHistory((prev) => [...prev, { sender: "agent", text: `I can only edit outlines when you are on the outline page.`, type: "message" }]);
            return;
        }

        setChatHistory((prev) => [...prev, { sender: "agent", text: `Activity 6 steps`, type: "activity_header", stepsCount: 6 }]);
        await wait(500);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `Clicking element: Outline Content`, type: "click" }]);
        await wait(300);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `done`, type: "done" }]);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `Entering text...`, type: "type_text" }]);
        await wait(400);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `done`, type: "done" }]);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `Clicking element: Save`, type: "click" }]);
        await wait(300);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `done`, type: "done" }]);
        
        // Dispatch Custom Event to Outline layer
        const event = new CustomEvent("SLIDEXY_AGENT_EDIT_OUTLINE", {
           detail: data.payload
        });
        window.dispatchEvent(event);

      } else if (data.action === "edit_slide") {
        if (!window.location.pathname.includes("/editor")) {
            setChatHistory((prev) => [...prev, { sender: "agent", text: `Activity 3 steps`, type: "activity_header", stepsCount: 3 }]);
            await wait(400);
            setChatHistory((prev) => [...prev, { sender: "agent", text: `Clicking element: Editor Link`, type: "click" }]);
            await wait(200);
            setChatHistory((prev) => [...prev, { sender: "agent", text: `done`, type: "done" }]);
            setChatHistory((prev) => [...prev, { sender: "agent", text: `Navigating to route: /editor`, type: "step" }]);
            localStorage.setItem("agentEditPayload", JSON.stringify(data.payload));
            router.push("/editor");
            return;
        }

        setChatHistory((prev) => [...prev, { sender: "agent", text: `Activity 6 steps`, type: "activity_header", stepsCount: 6 }]);
        await wait(500);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `Clicking element: Slide Visuals`, type: "click" }]);
        await wait(300);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `done`, type: "done" }]);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `Entering text...`, type: "type_text" }]);
        await wait(400);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `done`, type: "done" }]);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `Clicking element: Apply Changes`, type: "click" }]);
        await wait(300);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `done`, type: "done" }]);
        
        // Dispatch Custom Event to Editor layer
        const event = new CustomEvent("SLIDEXY_AGENT_EDIT_SLIDE", {
           detail: data.payload
        });
        window.dispatchEvent(event);
      } else if (data.action === "create_presentation" && data.url) {
        const needsNav = window.location.pathname !== data.url;
        const steps = needsNav ? 8 : 7;
        setChatHistory((prev) => [...prev, { sender: "agent", text: `Activity ${steps} steps`, type: "activity_header", stepsCount: steps }]);
        await wait(600);
        
        if (data.payload) {
           localStorage.setItem("agentPayload", JSON.stringify(data.payload));
        }

        if (needsNav) {
          setChatHistory((prev) => [...prev, { sender: "agent", text: `Navigating to route: ${data.url}`, type: "step" }]);
          router.push(data.url);
          await wait(800);
        }
        
        setChatHistory((prev) => [...prev, { sender: "agent", text: `Clicking element: Topic Input`, type: "click" }]);
        await wait(400);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `done`, type: "done" }]);
        
        setChatHistory((prev) => [...prev, { sender: "agent", text: `Entering text...`, type: "type_text" }]);
        await wait(200);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `done`, type: "done" }]);
        
        setChatHistory((prev) => [...prev, { sender: "agent", text: `Clicking element: Generate`, type: "click" }]);
        await wait(200);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `done`, type: "done" }]);
        
        if (!needsNav) {
          router.push(data.url);
        }
      } else if (data.action === "navigate" && data.url) {
        setChatHistory((prev) => [...prev, { sender: "agent", text: `Activity 3 steps`, type: "activity_header", stepsCount: 3 }]);
        await wait(500);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `Clicking element: Navigation Link`, type: "click" }]);
        await wait(200);
        setChatHistory((prev) => [...prev, { sender: "agent", text: `done`, type: "done" }]);
        if (window.location.pathname !== data.url) {
          setChatHistory((prev) => [...prev, { sender: "agent", text: `Navigating to route: ${data.url}`, type: "step" }]);
        }
        router.push(data.url);
      }

    } catch (error) {
      console.error("Agent error:", error);
      setChatHistory((prev) => [...prev, { sender: "agent", text: "Sorry, I encountered an error.", type: "message" }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AgentContext.Provider value={{ isOpen, setIsOpen, isProcessing, setIsProcessing, handleUserMessage, chatHistory }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
};