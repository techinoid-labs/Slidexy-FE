"use client";
import {
  Paper, List, ListItem, ListItemText, ListItemButton,
  Collapse, Divider, IconButton, Tooltip, Typography, Stack,
  Box
} from "@mui/material";
import { History, ExpandMore, ExpandLess, DeleteOutline, ContentCopy } from "@mui/icons-material";

export interface PromptHistoryItem {
  id: string;
  prompt: string;
  timestamp: number;
  pdfUrl?: string;
  title?: string;
}

interface PromptHistoryProps {
  history: PromptHistoryItem[];
  expanded: boolean;
  onToggleExpand: () => void;
  onLoadPrompt: (item: PromptHistoryItem) => void;
  onDeletePrompt: (id: string) => void;
  onCopyPrompt: (prompt: string) => void;
  formatDate: (timestamp: number) => string;
}

export default function PromptHistory({
  history,
  expanded,
  onToggleExpand,
  onLoadPrompt,
  onDeletePrompt,
  onCopyPrompt,
  formatDate
}: PromptHistoryProps) {
  return (
    <Paper elevation={0} sx={{
      borderRadius: 3,
      border: "1px solid #e8e4ff",
      bgcolor: "white",
      overflow: "hidden",
      transition: "all 0.3s ease",
      "&:hover": { boxShadow: "0 4px 20px rgba(108, 43, 217, 0.08)" }
    }}>
      <ListItemButton onClick={onToggleExpand} sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <History sx={{ color: "#8E2DE2", fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
            Prompt History
          </Typography>
          <Typography variant="caption" sx={{ color: "#6d6d6d" }}>
            {history.length} saved prompts
          </Typography>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </Stack>
      </ListItemButton>

      <Collapse in={expanded}>
        <Divider />
        <List sx={{ maxHeight: "400px", overflowY: "auto", p: 0 }}>
          {history.length === 0 ? (
            <Typography sx={{ p: 4, textAlign: "center", color: "#9e9e9e" }}>
              No prompt history yet
            </Typography>
          ) : (
            history.map((item, index) => (
              <Box key={item.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Copy">
                        <IconButton size="small" onClick={() => onCopyPrompt(item.prompt)}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => onDeletePrompt(item.id)} sx={{ color: "#f44336" }}>
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                >
                  <ListItemButton onClick={() => onLoadPrompt(item)}>
                    <ListItemText
                      primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{item.prompt}</Typography>}
                      secondary={<Typography variant="caption">{formatDate(item.timestamp)}</Typography>}
                    />
                  </ListItemButton>
                </ListItem>
              </Box>
            ))
          )}
        </List>
      </Collapse>
    </Paper>
  );
}
