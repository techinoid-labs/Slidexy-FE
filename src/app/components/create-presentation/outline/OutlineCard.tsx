import React from "react";
import {
  Paper,
  IconButton,
  Box,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Image from "next/image";



 function ImageWithClick({
  src,
  alt,
  onShowLarge,
  onRegenerate,
}: {
  src: string;
  alt: string;
  onShowLarge?: () => void;
  onRegenerate?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  const handleClick = () => {
    if (isDesktop && onShowLarge) {
      onShowLarge();
    } else {
      setOpen(true);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => setMenuAnchor(null);

  const handleRegenerateClick = () => {
    handleMenuClose();
    onRegenerate?.();
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: { xs: 48, sm: 56, md: 64 },
          height: { xs: 48, sm: 56, md: 64 },
          borderRadius: 2,
          bgcolor: "#F2F0FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: "pointer",
          "&:hover .overlay": {
            display: "flex",
          },
        }}
        onClick={handleClick}
      >
        <Image
          src={src}
          alt={alt}
          width={32}
          height={32}
          style={{
            objectFit: "contain",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
        {/* Hover-triggered overlay */}
        <Box
          className="overlay"
          sx={{
            display: "none",
            position: "absolute",
            top: 2,
            right: 2,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderRadius: "50%",
            zIndex: 2,
          }}
          onClick={handleMenuOpen}
        >
          <IconButton size="small" sx={{ p: 0.5 }}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Menu for regenerate */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleRegenerateClick}>Regenerate Image</MenuItem>
      </Menu>

      {/* Mobile enlarged view */}
      {!isDesktop && open && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.4)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOpen(false)}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 4,
              p: 2,
              width: { xs: 180, sm: 220 },
              height: { xs: 180, sm: 220 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={160}
              height={160}
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}

interface OutlineCardProps {
  index: number;
  title: string;
  onDelete: () => void;
  dragHandleProps?: any;
  isDragging?: boolean;
  expanded?: boolean;
  bullets?: string[];
  images?: string[];
  onEdit?: (event: React.MouseEvent<HTMLElement>) => void;
  editable?: boolean;
  isEditing?: boolean;
  editingTitle?: string;
  onTitleEditStart?: () => void;
  onTitleEditChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleEditSave?: () => void;
  onTitleEditCancel?: () => void;
  // Bullets paragraph editing
  editingBulletsIdx?: number | null;
  editingBulletsValue?: string;
  onBulletsEditStart?: () => void;
  onBulletsEditChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBulletsEditSave?: () => void;
  onBulletsEditCancel?: () => void;
  onImageClick?: (e: React.MouseEvent) => void;
}

const OutlineCard: React.FC<OutlineCardProps> = (props) => {
  const {
    index,
    title,
    onDelete,
    dragHandleProps,
    isDragging = false,
    expanded = false,
    bullets = [],
    images = [],
    onEdit,
    editable = false,
    isEditing = false,
    editingTitle = "",
    onTitleEditStart,
    onTitleEditChange,
    onTitleEditSave,
    onTitleEditCancel,
    editingBulletsIdx,
    editingBulletsValue,
    onBulletsEditStart,
    onBulletsEditChange,
    onBulletsEditSave,
    onBulletsEditCancel,
  } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [largeImageIdx, setLargeImageIdx] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onTitleEditSave && onTitleEditSave();
    } else if (e.key === "Escape") {
      onTitleEditCancel && onTitleEditCancel();
    }
  };


  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: "20px",
        bgcolor: "#F2F0FF",
        boxShadow: isDragging ? 4 : 0,
        transition: "box-shadow 0.2s",
        p: 0,
        m: 0,
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: 56,
          bgcolor: "#F2F0FF",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      >
        {/* Drag handle and number */}
        <Box
          {...dragHandleProps}
          sx={{
            color: "#8E2DE2",
            fontWeight: 700,
            fontSize: 20,
            minWidth: 48,
            textAlign: "center",
            letterSpacing: 1,
            pl: 2,
            pr: 1,
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {/* Icon on the left of title and count */}
          <Image
            src="/images/left-grid.svg"
            alt="Card Icon"
            width={12}
            height={12}
            style={{ marginRight: 1 }}
          />
          {index < 9 ? `0${index + 1}` : index + 1}
        </Box>
        {/* Title */}
        {editable && isEditing ? (
          <input
            ref={inputRef}
            value={editingTitle}
            onChange={onTitleEditChange}
            onBlur={onTitleEditSave}
            onKeyDown={handleKeyDown}
            style={{
              fontWeight: 500,
              color: "#18181B",
              fontSize: 16,
              flex: 1,
              textAlign: "left",
              paddingLeft: 8,
              border: "1px solid #8E2DE2",
              borderRadius: 6,
              outline: "none",
              minWidth: 0,
              maxWidth: "90%",
            }}
            className="text-sm sm:text-base md:text-lg"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <Typography
            sx={{
              fontWeight: 500,
              color: "#18181B",
              fontSize: { xs: 14, sm: 16, md: 18 },
              flex: 1,
              textAlign: "left",
              pl: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: editable ? "pointer" : "default",
            }}
            className="text-sm sm:text-base md:text-lg"
            noWrap
            onClick={
              editable
                ? (e) => {
                    e.stopPropagation();
                    onTitleEditStart && onTitleEditStart();
                  }
                : undefined
            }
            title={title}
          >
            {title}
          </Typography>
        )}
        {/* Vertical divider before edit/delete icons */}
        {/* Delete icon */}
        <IconButton
          onClick={onDelete}
          size="small"
          sx={{ color: "#A095C6", pr: 2 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      {/* Expanded Content */}
      {expanded && (
        <Box
          sx={{
            bgcolor: "#fff",
            px: { xs: 2, sm: 3 },
            pt: 2,
            pb: 1.5,
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            position: "relative",
          }}
        >
          {/* Bullets */}
          {bullets && bullets.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {editable && editingBulletsIdx === index ? (
                <Box sx={{ position: "relative", width: "100%" }}>
                  <textarea
                    value={editingBulletsValue}
                    onChange={onBulletsEditChange}
                    onBlur={onBulletsEditSave}
                    style={{
                      width: "100%",
                      minHeight: 80,
                      fontSize: 16,
                      color: "#18181B",
                      border: "1px solid #8E2DE2",
                      borderRadius: 6,
                      outline: "none",
                      padding: "8px",
                      resize: "vertical",
                    }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onBulletsEditSave && onBulletsEditSave();
                      } else if (e.key === "Escape") {
                        onBulletsEditCancel && onBulletsEditCancel();
                      }
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 1,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={onBulletsEditSave}
                      style={{
                        background: "#8E2DE2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={onBulletsEditCancel}
                      style={{
                        background: "#eee",
                        color: "#333",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 20,
                      color: "#757575",
                      fontSize: 16,
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    {bullets.map((b, i) => (
                      <li
                        key={i}
                        onClick={
                          editable
                            ? (e) => {
                                e.stopPropagation();
                                onBulletsEditStart && onBulletsEditStart();
                              }
                            : undefined
                        }
                        style={{ cursor: editable ? "pointer" : "default" }}
                        title={b}
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </Box>
          )}
          {/* Horizontal divider after outline points */}
          {/* Images Row */}
          {images.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              {images.map((src, i) => (
                <span key={i} style={{ display: "inline-flex" }}>
                  <ImageWithClick
                    src={src}
                    alt={`img-${i}`}
                    onShowLarge={() => setLargeImageIdx(i)}
                    onRegenerate={() => {
                      console.log("Regenerate image at index", i);
                      // You can call your regenerate function here and pass index/image ID
                    }}
                  />
                </span>
              ))}
            </Box>
          )}
          {/* Desktop large image preview */}
          {typeof window !== "undefined" &&
            window.innerWidth >= 768 &&
            largeImageIdx !== null &&
            images[largeImageIdx] && (
              <Box
                sx={{
                  position: "absolute",
                  right: 200, // move further to the left
                  bottom: 40, // move a little further down
                  zIndex: 3,
                  bgcolor: "#fff",
                  borderRadius: 1, // less rounded
                  boxShadow: 4,
                  p: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 130, // increased more
                  height: 130, // increased more
                  cursor: "pointer",
                }}
                onClick={() => setLargeImageIdx(null)}
              >
                <Image
                  src={images[largeImageIdx]}
                  alt={`large-img-${largeImageIdx}`}
                  width={120}
                  height={120}
                  style={{
                    objectFit: "contain",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    borderRadius: 6,
                  }}
                />
              </Box>
            )}
        </Box>
      )}
      {/* Edit icon bottom right - only show when expanded */}
      {expanded && (
        <Box
          sx={{
            position: "absolute",
            bottom: 38, // move it a little above the bottom
            right: 20,
            zIndex: 2,
          }}
        >
          <IconButton
            size="small"
            sx={{ p: 0 }} // remove background and shadow
            onClick={onEdit}
          >
            <Image
              src="/images/regenerate-card.svg"
              alt="Edit"
              width={20}
              height={20}
              style={{ display: "block" }}
            />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
};

export default OutlineCard;

