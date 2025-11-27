import { IconButton, Tooltip } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

interface Props {
  onClick: () => void;
}

export default function ChatButton({ onClick }: Props) {
  return (
    <Tooltip title="Slidexy AI" placement="top">
      <IconButton
        onClick={onClick}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
          color: "#fff",
          transform: "scale(1.2)",
          transition: "all 0.2s ease",
          "&:hover": {
            background: "linear-gradient(80.89deg, #7A1CCF -90.43%, #3A00C0 74.73%)",
          },
          zIndex: 1000,
        }}
      >
        <ChatIcon />
      </IconButton>
    </Tooltip>
  );
}
