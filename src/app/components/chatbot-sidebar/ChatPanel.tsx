import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useChat } from "./useChat";
import GenerateSlide from "./GenerateSlide";

interface Props {
  onClose: () => void;
}

export default function ChatPanel({ onClose }: Props) {
  const { messages, input, setInput, loading, sendMessage, chatEndRef, toggleAgentMode, isAgentActive,tone,topic,style } = useChat();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 10,
        right: 10,
        height: "85vh",
        width: { xs: "100%", sm: "400px" },
        bgcolor: "rgba(249, 249, 251, 0.99)",
        boxShadow: "-4px 0 16px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1200,
        border: "1px solid rgba(231, 231, 231, 1)",
        borderRadius: 1,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <IconButton onClick={onClose} sx={{ color: "#000" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <ChatMessages messages={messages} loading={loading} chatEndRef={chatEndRef} />
      {isAgentActive && topic && tone && style && (
  <GenerateSlide topic={topic} tone={tone} style={style} />
)}
      <Button
        variant={isAgentActive ? "contained" : "outlined"}
        onClick={toggleAgentMode}
        sx={{ mb: 1 }}
      >
        Agent Mode: {isAgentActive ? "ON" : "OFF"}
      </Button>
      <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} loading={loading} />
      <Box
        sx={{
          pb: 1,
          color: "grey",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography>Slidexy AI</Typography>
      </Box>
    </Box>
  );
}
