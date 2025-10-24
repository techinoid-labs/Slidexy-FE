"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "../../context/AuthContext";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatBotSidebar() {
  const { user } = useUser(); 
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    const fetchChatHistory = async () => {
    if (!user || !user.email) return; // skip for guests

    if (!user.email) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const res = await fetch(`${baseUrl}/api/chat/history/${user.email}`);
      const data = await res.json();

      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };
  fetchChatHistory();
}, [user]);


  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
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

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            bgcolor: "#2E86C1",
            color: "#fff",
            "&:hover": { bgcolor: "#1B4F72" },
            zIndex: 1000,
          }}
        >
          <ChatIcon />
        </IconButton>
      )}

      {/* Sidebar Chat Panel */}
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100vh",
            width: { xs: "100%", sm: "400px" },
            bgcolor: "#ffffff",
            boxShadow: "-4px 0 16px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1200,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: "#2E86C1",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">Slidexy Assistant 🤖</Typography>
            <IconButton onClick={() => setIsOpen(false)} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Area */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  bgcolor: msg.sender === "user" ? "#2E86C1" : "#E5E7E9",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: "75%",
                }}
              >
                {msg.text}
              </Box>
            ))}
            {loading && (
              <Box sx={{ alignSelf: "center", mt: 1 }}>
                <CircularProgress size={20} />
              </Box>
            )}
            <div ref={chatEndRef} />
          </Box>

          {/* Input Box */}
          <Box
            sx={{
              p: 1.5,
              borderTop: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <IconButton
              onClick={sendMessage}
              disabled={loading}
              sx={{ bgcolor: "#2E86C1", color: "#fff", "&:hover": { bgcolor: "#1B4F72" } }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  );
}