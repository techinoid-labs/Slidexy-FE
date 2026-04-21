"use client";

import React, { useState } from "react";
import { useAgent } from "../../context/AgentContext";
import { Box, IconButton, Paper, TextField, Typography, Button, Slide } from "@mui/material";
import AssistantIcon from "@mui/icons-material/Assistant";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import TerminalIcon from "@mui/icons-material/Terminal";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CheckIcon from "@mui/icons-material/Check";

export default function AiChatWidget() {
  const { isOpen, setIsOpen, isProcessing, chatHistory, handleUserMessage } = useAgent();
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const msg = inputValue;
    setInputValue("");
    handleUserMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (msg: any, i: number) => {
    if (msg.type === "activity_header") {
      return (
        <Box key={i} sx={{ alignSelf: "flex-start", display: "flex", alignItems: "center", mt: 1, mb: 0.5, bgcolor: "grey.100", px: 1.5, py: 0.5, borderRadius: 2 }}>
          <AutoFixHighIcon sx={{ fontSize: 16, mr: 1, color: "primary.main" }} />
          <Typography variant="body2" fontWeight="bold">
            {msg.text}
          </Typography>
        </Box>
      );
    }

    if (msg.type === "screenshot" || msg.type === "click" || msg.type === "type_text" || msg.type === "done") {
      let icon = <CheckIcon sx={{ fontSize: 14, color: "success.main" }} />;
      if (msg.type === "screenshot") icon = <ImageOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />;
      if (msg.type === "click") icon = <AdsClickIcon sx={{ fontSize: 14, color: "text.secondary" }} />;
      if (msg.type === "type_text") icon = <KeyboardIcon sx={{ fontSize: 14, color: "text.secondary" }} />;

      return (
        <Box key={i} sx={{ display: "flex", alignItems: "center", ml: 2, my: 0.3 }}>
          <Box sx={{ width: 24, display: "flex", justifyContent: "center", alignItems: "center", mr: 0.5 }}>{icon}</Box>
          <Typography variant="caption" sx={{ color: msg.type === "done" ? "success.main" : "text.secondary", fontFamily: "monospace" }}>
            {msg.text}
          </Typography>
        </Box>
      );
    }

    if (msg.type === "activity" || msg.type === "step" || msg.type === "success") {
      let icon = <TerminalIcon sx={{ fontSize: 16, mr: 1, color: "grey.500" }} />;
      let color = "text.secondary";
      
      if (msg.type === "step") {
        icon = <PlayArrowIcon sx={{ fontSize: 16, mr: 1, color: "primary.main" }} />;
      } else if (msg.type === "success") {
        icon = <CheckCircleOutlineIcon sx={{ fontSize: 16, mr: 1, color: "success.main" }} />;
        color = "success.main";
      }

      return (
        <Box
          key={i}
          sx={{
            alignSelf: "flex-start",
            bgcolor: "grey.900",
            color: "grey.300",
            fontFamily: "monospace",
            p: 1.5,
            borderRadius: 1,
            maxWidth: "90%",
            wordBreak: "break-word",
            display: "flex",
            alignItems: "center",
            boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)",
            border: "1px solid",
            borderColor: "grey.800"
          }}
        >
          {icon}
          <Typography variant="caption" sx={{ fontFamily: "monospace", color: msg.type === "success" ? "#4caf50" : "#a5d6a7" }}>
            {msg.text}
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        key={i}
        sx={{
          alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
          bgcolor: msg.sender === "user" ? "primary.main" : "grey.100",
          color: msg.sender === "user" ? "white" : "text.primary",
          p: 1.5,
          borderRadius: 2,
          maxWidth: "80%",
          wordBreak: "break-word",
        }}
      >
        <Typography variant="body2">{msg.text}</Typography>
      </Box>
    );
  };

  return (
    <>
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          bgcolor: "primary.main",
          color: "white",
          boxShadow: 3,
          "&:hover": { bgcolor: "primary.dark" },
          width: 56,
          height: 56,
          zIndex: 9999,
        }}
      >
        {isOpen ? <CloseIcon /> : <AssistantIcon />}
      </IconButton>

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: 360,
            height: 500,
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Slidexy AI Assistant
            </Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: "white" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Chat History */}
          <Box sx={{ flex: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
            {chatHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
                Hi! Ask me to generate a pitch deck, an infographic, or navigate the app!
              </Typography>
            ) : (
              chatHistory.map((msg, i) => renderMessage(msg, i))
            )}
            {isProcessing && (
              <Box sx={{ alignSelf: "flex-start", bgcolor: "grey.100", p: 1.5, borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">Thinking...</Typography>
              </Box>
            )}
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 1.5, borderTop: 1, borderColor: "divider", display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="E.g., Create a 10 slide deck about AI..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              autoFocus
            />
            <IconButton color="primary" onClick={handleSend} disabled={!inputValue.trim() || isProcessing}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
}