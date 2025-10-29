import { IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

interface Props {
  onClick: () => void;
}

export default function ChatButton({ onClick }: Props) {
  return (
    <IconButton
      onClick={onClick}
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
  );
}
