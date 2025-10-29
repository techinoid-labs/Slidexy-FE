import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useChat } from "./useChat";

interface Props {
  onClose: () => void;
}

export default function ChatPanel({ onClose }: Props) {
  const { messages, input, setInput, loading, sendMessage, chatEndRef } = useChat();

  return (
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
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <ChatMessages messages={messages} loading={loading} chatEndRef={chatEndRef} />
      <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} loading={loading} />
    </Box>
  );
}
