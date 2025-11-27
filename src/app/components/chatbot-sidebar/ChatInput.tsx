import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ArrowBack, ArrowUpwardTwoTone } from "@mui/icons-material";

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
        border: 'none'
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="ask anything"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        sx={{
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              border: "1px solid rgb(142, 45, 227)",
              "& .MuiInputBase-input": { fontSize: "15px", lineHeight: 1.6 },
              borderRadius: 1,
            }}
      />
      <IconButton
        onClick={sendMessage}
        disabled={loading}
        sx={{
          bgcolor: "rgb(142, 45, 227)",
          color: "#fff",
          "&:hover": {
            border: "1px solid rgb(142, 45, 227)",
            bgcolor: "rgb(142, 45, 227)"
          },
        }}
      >
        <ArrowUpwardTwoTone />
      </IconButton>
    </Box>
  );
}
