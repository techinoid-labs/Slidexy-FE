import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Props {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
  loading: boolean;
}

export default function ChatInput({ input, setInput, sendMessage, loading }: Props) {
  return (
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
        sx={{
          bgcolor: "#2E86C1",
          color: "#fff",
          "&:hover": { bgcolor: "#1B4F72" },
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}
