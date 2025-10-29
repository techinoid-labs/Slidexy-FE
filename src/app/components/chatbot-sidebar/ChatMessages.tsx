import { Box, CircularProgress } from "@mui/material";
import { Message } from "./useChat";

interface Props {
  messages: Message[];
  loading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement|null>;
}

export default function ChatMessages({ messages, loading, chatEndRef }: Props) {
  return (
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
  );
}
