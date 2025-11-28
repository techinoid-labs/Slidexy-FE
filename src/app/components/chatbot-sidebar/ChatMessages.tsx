import { Box, CircularProgress, Button } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Message } from "./useChat";

interface Props {
  messages: Message[];
  loading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  onSelectOption?: (type: "tone" | "style", value: string) => void; // new prop
}

const TONE_OPTIONS = ["professional", "casual", "inspirational"];
const STYLE_OPTIONS = [
  "Concept Art",
  "3D Render / CGI",
  "Watercolor Illustration",
  "AI Collage / Mixed Media",
  "Digital Painting",
  "Fantasy / Sci-Fi Style",
  "Minimal Abstract",
];

export default function ChatMessages({ messages, loading, chatEndRef, onSelectOption }: Props) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: "8px" },
        "&::-webkit-scrollbar-thumb": { background: "grey", borderRadius: "8px" },
      }}
    >
      {messages.map((msg, i) => {
        // Check for special placeholders
        if (msg.text === "__tone_options__") {
          return (
            <Box key={i} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {TONE_OPTIONS.map((tone) => (
                <Button
                  key={tone}
                  variant="outlined"
                  size="small"
                  onClick={() => onSelectOption?.("tone", tone)}
                >
                  {tone}
                </Button>
              ))}
            </Box>
          );
        }

        if (msg.text === "__style_options__") {
          return (
            <Box key={i} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {STYLE_OPTIONS.map((style) => (
                <Button
                  key={style}
                  variant="outlined"
                  size="small"
                  onClick={() => onSelectOption?.("style", style)}
                >
                  {style}
                </Button>
              ))}
            </Box>
          );
        }

        return (
          <Box
            key={i}
            sx={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              bgcolor: msg.sender === "user" ? "rgb(142, 45, 227)" : "#fcfcfd",
              color: msg.sender === "user" ? "#fff" : "#000",
              p: 1.5,
              borderRadius: 1,
              maxWidth: "75%",
              wordBreak: "break-word",
              "& p": { margin: 0 },
              "& code": { background: "rgba(0,0,0,0.08)", padding: "2px 4px", borderRadius: "4px", fontSize: "0.9em" },
              "& pre": { background: "rgba(0,0,0,0.1)", padding: "8px", borderRadius: "6px", overflowX: "auto" },
            }}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </Box>
        );
      })}
      {loading && (
        <Box sx={{ alignSelf: "center", mt: 1 }}>
          <CircularProgress size={20} />
        </Box>
      )}
      <div ref={chatEndRef} />
    </Box>
  );
}