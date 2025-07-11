import React, { useState } from "react";
import {
    Box,
    Button,
    Divider,
    Typography,
    IconButton,
    Slider,
    InputBase,
    Switch,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LockIcon from "@mui/icons-material/Lock";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// Dummy image and icon paths (replace with your actual asset paths)
const alignIcons = [
    "/alignleft.svg",
    "/aligncenter.svg",
    "/alignright.svg",
    "/aligndistribute.svg",
    "/aligntop.svg",
    "/alignmiddle.svg",
    "/alignbottom.svg",
];

const filterOptions = [
    { name: "None", img: "/none-icon.svg" },
    { name: "Noir", img: "/sample-effects.svg" },
    { name: "Gray", img: "/sample-effects.svg" },
    { name: "Vintage", img: "/sample-effects.svg" },
    { name: "Bright", img: "/sample-effects.svg" },
    { name: "Dynamic", img: "/sample-effects.svg" },
    { name: "Faded", img: "/sample-effects.svg" },
    { name: "Vibrant", img: "/sample-effects.svg" },
];

const ImageSettingsPanel: React.FC<{ sidebarHeight?: string | number }> = ({
    sidebarHeight = "100vh",
}) => {
    const [value, setValue] = useState(56);
    const [effectAnchorEl, setEffectAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedEffect, setSelectedEffect] = useState("Overlay");
    const effectMenuOpen = Boolean(effectAnchorEl);
    const [selectedFilter, setSelectedFilter] = useState("None");
    const [colorAnchorEl, setColorAnchorEl] = useState<null | HTMLElement>(null);
    const [chosenColor, setChosenColor] = useState("#FBFAFF");
    const colorPaletteOpen = Boolean(colorAnchorEl);

    const handleEffectClick = (event: React.MouseEvent<HTMLElement>) => {
      setEffectAnchorEl(event.currentTarget);
    };

    const handleEffectClose = (effect?: string) => {
      if (effect) setSelectedEffect(effect);
      setEffectAnchorEl(null);
    };

    const handleColorCircleClick = (event: React.MouseEvent<HTMLElement>) => {
        setColorAnchorEl(event.currentTarget);
    };
    const handleColorPaletteClose = () => {
        setColorAnchorEl(null);
    };
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChosenColor(e.target.value);
    };

    return (
        <Box
            sx={{
                width: 410,
                bgcolor: "#fff",
                height: sidebarHeight,
                display: "flex",
                flexDirection: "column",
                p: 0,
                borderRight: "1px solid #E0E0E0",
                overflowY: "auto",
            }}
        >
            {/* Tabs */}
            <Box sx={{ display: "flex", alignItems: "center", px: 2, pt: 2, pb: 1 }}>
                <Box
                    sx={{
                        bgcolor: "#F5F5F5",
                        color: "#222",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2.5,
                        py: 1,
                        fontSize: 15,
                        mr: 2,
                    }}
                >
                    Settings
                </Box>
                <Box
                    sx={{
                        color: "#888",
                        fontWeight: 500,
                        fontSize: 15,
                        mr: 2,
                        py: 1,
                        cursor: "pointer",
                    }}
                >
                    Animate
                </Box>
                <Box sx={{ flex: 1, borderColor: "#FFFFFF" }} />
                <Button
                    onClick={handleEffectClick}
                    sx={{
                        fontSize: 15,
                        bgcolor: "#FFFFFF",
                        borderRadius: 2,
                        width: 100,
                        height: 32,
                        color: "#454545",
                        boxShadow: "none",
                        textTransform: "none",
                        justifyContent: "flex-start",
                        pl: 2,
                    }}
                    endIcon={<ArrowDropDownIcon />}
                >
                    {selectedEffect}
                </Button>
                <Menu
                    anchorEl={effectAnchorEl}
                    open={effectMenuOpen}
                    onClose={() => handleEffectClose()}
                    PaperProps={{
                        sx: {
                            bgcolor: "#F7F7F9",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            minWidth: 120,
                            mt: 1,
                        },
                    }}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    {["Overlay", "Opacity", "Blur", "Shadow"].map((option) => (
                        <MenuItem
                            key={option}
                            selected={selectedEffect === option}
                            onClick={() => handleEffectClose(option)}
                            sx={{
                                fontSize: 17,
                                color: "#454545",
                                bgcolor: "#F7F7F9",
                                "&.Mui-selected": { bgcolor: "#F7F7F9", fontWeight: 500 },
                                "&:hover": { bgcolor: "#EFEFF2" },
                                borderRadius: 2,
                                minHeight: 36,
                            }}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>

            {/* Size & Position */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ px: 3, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                        sx={{ fontWeight: 500, fontSize: 16, flex: 1, color: "#454545" }}
                    >
                        Size & Position
                    </Typography>
                    <IconButton size="small">
                        <ArrowDropDownIcon />
                    </IconButton>
                </Box>
                {/* Alignment Buttons */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        mb: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            bgcolor: "#F8F8FA",
                            borderRadius: 1,
                            p: 1,
                            justifyContent: "center",
                        }}
                    >
                        <IconButton sx={{ width: 40, height: 40 }}>
                            <img src="/alignleft.svg" alt="Align Left" style={{ width: 25, height: 25 }} />
                        </IconButton>
                        <IconButton sx={{ width: 40, height: 40 }}>
                            <img src="/align-right.svg" alt="Align Right" style={{ width: 25, height: 25 }} />
                        </IconButton>
                        <IconButton sx={{ width: 40, height: 40 }}>
                            <img src="/align-center.svg" alt="Align Center" style={{ width: 25, height: 25 }} />
                        </IconButton>
                        <IconButton sx={{ width: 40, height: 40 }}>
                            <img src="/align-center-vertical.svg" alt="Align Center Vertical" style={{ width: 25, height: 25 }} />
                        </IconButton>
                        <IconButton sx={{ width: 40, height: 40 }}>
                            <img src="/align-bottom.svg" alt="Align Bottom" style={{ width: 25, height: 25 }} />
                        </IconButton>
                        <IconButton sx={{ width: 40, height: 40 }}>
                            <img src="/align-top.svg" alt="Align Top" style={{ width: 25, height: 25 }} />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            bgcolor: "#F8F8FA",
                            borderRadius: 1,
                            p: 1,
                            justifyContent: "center",
                            gap: -1
                        }}
                    >
                        <IconButton sx={{ width: 40, height: 40 }}>
                            <img src="/swap-1.svg" alt="Swap 1" style={{ width: 25, height: 25 }} />
                        </IconButton>
                        <IconButton sx={{ width: 40, height: 40 }}>
                            <img src="/swap-2.svg" alt="Swap 2" style={{ width: 25, height: 25 }} />
                        </IconButton>
                    </Box>
                </Box>

                {/* Size and Position Inputs */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 5, mb: 1 }}>
                    {/* W + Input */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#454545",
                                fontWeight: 450,
                                fontSize: 20,
                            }}
                        >
                            W
                        </Typography>
                        <Box
                            sx={{
                                bgcolor: "#fff",
                                border: "1px solid #F6F6F6",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                                borderRadius: 0.5,
                                px: 1.5,
                                py: 0.5,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <InputBase
                                value="56"
                                sx={{
                                    width: 50,
                                    fontWeight: 400,
                                    fontSize: 16,
                                    input: { textAlign: "center" },
                                    color: "#6D6D6D"
                                }}
                                inputProps={{ style: { textAlign: "center" } }}
                            />
                        </Box>
                    </Box>

                    {/* H + Input */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#454545",
                                fontWeight: 450,
                                fontSize: 20,

                            }}
                        >
                            H
                        </Typography>
                        <Box
                            sx={{
                                bgcolor: "#fff",
                                border: "1px solid #F6F6F6",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                                borderRadius: 0.5,
                                px: 1.5,
                                py: 0.5,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <InputBase
                                value="24"
                                sx={{
                                    width: 50,
                                    fontWeight: 400,
                                    fontSize: 16,
                                    input: { textAlign: "center" },
                                    color: "#6D6D6D"
                                }}
                                inputProps={{ style: { textAlign: "center" } }}
                            />
                        </Box>
                    </Box>

                    {/* Lock Icon */}
                    <Box
                        sx={{
                            display: "flex",
                            bgcolor: "#F8F8FA",
                            borderRadius: 1,
                            p: 1,
                            justifyContent: "center",
                            maxWidth: "100px"

                        }}
                    >
                        <IconButton sx={{ width: 40, height: 30 }}>
                            <img src="/lock-icon.svg" alt="Lock Icon" style={{ width: 18, height: 18 }} />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 5.8, mb: 1 }}>
                    {/* X + Input */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#454545",
                                fontWeight: 450,
                                fontSize: 20,
                            }}
                        >
                            X
                        </Typography>
                        <Box
                            sx={{
                                bgcolor: "#fff",
                                border: "1px solid #F6F6F6",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                                borderRadius: 0.5,
                                px: 1.5,
                                py: 0.5,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <InputBase
                                value="56"
                                sx={{
                                    width: 50,
                                    fontWeight: 400,
                                    fontSize: 16,
                                    input: { textAlign: "center" },
                                    color: "#6D6D6D"
                                }}
                                inputProps={{ style: { textAlign: "center" } }}
                            />
                        </Box>
                    </Box>

                    {/* Y + Input */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#454545",
                                fontWeight: 450,
                                fontSize: 20,

                            }}
                        >
                            Y
                        </Typography>
                        <Box
                            sx={{
                                bgcolor: "#fff",
                                border: "1px solid #F6F6F6",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                                borderRadius: 0.5,
                                px: 1.5,
                                py: 0.5,
                                display: "flex",
                                alignItems: "center",
                                ml: -1,
                            }}
                        >
                            <InputBase
                                value="24"
                                sx={{
                                    width: 50,
                                    fontWeight: 400,
                                    fontSize: 16,
                                    input: { textAlign: "center" },
                                    color: "#6D6D6D"
                                }}
                                inputProps={{ style: { textAlign: "center" } }}
                            />
                        </Box>
                    </Box>

                    {/* Degree Input Base */}
                    <Box
                        sx={{
                            display: "flex",
                            bgcolor: "#F8F8FA",
                            borderRadius: 1,
                            p: 1,
                            justifyContent: "center",

                        }}
                    >
                        <InputBase
                            value="45°"
                            sx={{
                                width: 40,
                                fontWeight: 400,
                                fontSize: 18,
                                input: { textAlign: "center" },
                                color: "#6D6D6D"
                            }}
                            inputProps={{ style: { textAlign: "center" } }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Content */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ px: 3, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                        sx={{ fontWeight: 500, fontSize: 16, flex: 1, color: "#454545" }}
                    >
                        Content
                    </Typography>
                    <IconButton size="small">
                        <ArrowDropDownIcon />
                    </IconButton>
                </Box>
                {/* Image Preview */}
                <Box
                    sx={{
                        width: "100%",
                        aspectRatio: "16/9",
                        borderRadius: 3,
                        overflow: "hidden",
                        mb: 1.5,
                        position: "relative",
                    }}
                >
                    <img
                        src="/sample-content-image.jpg"
                        alt="Preview"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 12,
                        }}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "rgba(0,0,0,0.5)",
                            color: "#fff",
                            borderRadius: 2,
                            px: 2,
                            py: 0.5,
                            fontWeight: 600,
                            fontSize: 15,
                            textTransform: "none",
                            minWidth: 0,
                        }}
                    >
                        Replace
                    </Button>
                </Box>
                {/* Border Radius and Set as Background */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: 15, flex: 1 }}>
                        Border Radius
                    </Typography>
                    <Box
                        sx={{
                            bgcolor: "#fff",
                            border: "1px solid #F6F6F6",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                            borderRadius: 0.5,
                            px: 1.5,
                            py: 0.5,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <InputBase
                            value="56%"
                            sx={{
                                width: 50,
                                fontWeight: 400,
                                fontSize: 16,
                                input: { textAlign: "center" },
                                color: "#6D6D6D"
                            }}
                            inputProps={{ style: { textAlign: "center" } }}
                        />
                    </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: 15, flex: 1 }}>
                        Set as Background
                    </Typography>
                    <Switch />
                </Box>
            </Box>

            {/* Filter */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ px: 3, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                        sx={{ fontWeight: 500, fontSize: 16, flex: 1, color: "#454545" }}
                    >
                        Filter
                    </Typography>
                    <IconButton size="small">
                        <ArrowDropDownIcon />
                    </IconButton>
                </Box>
                {/* Filter Options */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 1,
                        mb: 1,
                    }}
                >
                    {filterOptions.map((filter, idx) => (
                        <Box
                            key={filter.name}
                            onClick={() => setSelectedFilter(filter.name)}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                                border: selectedFilter === filter.name
                                    ? "2px solid #BDBDBD"
                                    : "2px solid transparent",
                                borderRadius: 1,
                                p: 0.5,
                                bgcolor: "#FFFFFF",
                                transition: "border 0.2s",
                            }}
                        >
                            <img
                                src={filter.img}
                                alt={filter.name}
                                style={{
                                    width: 55,
                                    height: 58,
                                    borderRadius: 8,
                                    marginBottom: 2,
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#888",
                                    fontWeight: 500,
                                    fontSize: 15,
                                    textAlign: "center",
                                }}
                            >
                                {filter.name}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Effects */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ px: 3, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                        sx={{ fontWeight: 500, fontSize: 16, flex: 1, color: "#454545" }}
                    >
                        Effects
                    </Typography>
                    <Button
                        onClick={handleEffectClick}
                        sx={{
                            fontSize: 15,
                            bgcolor: "#FFFFFF",
                            borderRadius: 2,
                            width: 100,
                            height: 32,
                            color: "#454545",
                            boxShadow: "none",
                            textTransform: "none",
                            justifyContent: "flex-start",
                            pl: 2,
                        }}
                        endIcon={<ArrowDropDownIcon />}
                    >
                        {selectedEffect}
                    </Button>
                    <Menu
                        anchorEl={effectAnchorEl}
                        open={effectMenuOpen}
                        onClose={() => handleEffectClose()}
                        PaperProps={{
                            sx: {
                                bgcolor: "#F7F7F9",
                                borderRadius: 2,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                minWidth: 120,
                                mt: 1,
                            },
                        }}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                    >
                        {["Overlay", "Opacity", "Blur", "Shadow"].map((option) => (
                            <MenuItem
                                key={option}
                                selected={selectedEffect === option}
                                onClick={() => handleEffectClose(option)}
                                sx={{
                                    fontSize: 17,
                                    color: "#454545",
                                    bgcolor: "#F7F7F9",
                                    "&.Mui-selected": { bgcolor: "#F7F7F9", fontWeight: 500 },
                                    "&:hover": { bgcolor: "#EFEFF2" },
                                    borderRadius: 2,
                                    minHeight: 36,
                                }}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: 15, flex: 1 }}>
                        Choose Color
                    </Typography>
                    <Box
                        onClick={handleColorCircleClick}
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: chosenColor,
                            border: "2px solid #E0E0E0",
                            cursor: "pointer",
                            mr: 1.5,
                        }}
                    />
                    <Popover
                        open={colorPaletteOpen}
                        anchorEl={colorAnchorEl}
                        onClose={handleColorPaletteClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        PaperProps={{ sx: { p: 2, bgcolor: "#fff", boxShadow: 3, borderRadius: 2 } }}
                    >
                        <input
                            type="color"
                            value={chosenColor}
                            onChange={handleColorChange}
                            style={{ width: 40, height: 40, border: "none", background: "none", cursor: "pointer" }}
                        />
                    </Popover>                   
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Slider
                        value={value}
                        onChange={(_, newValue) => setValue(newValue as number)}
                        sx={{
                            color: "#7B4AE2",
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                        }}
                    />
                    <InputBase
                        value={`${value}%`}
                        readOnly
                        sx={{
                            width: 54,
                            fontWeight: 500,
                            fontSize: 17,
                            bgcolor: "#FFFFF",
                            borderRadius: 2,
                            px: 1.5,
                            py: 0.5,
                            textAlign: "center",
                        }}
                        inputProps={{ style: { textAlign: "center" } }}
                    />
                </Box>
            </Box>

            {/* Layer Order */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ px: 3, mb: 2, display: "flex", gap: 2 }}>
                <Button
                    variant="outlined"
                    endIcon={
                        <img
                            src="/forward-icon.svg"
                            alt="Forward"
                            style={{ width: 20, height: 20 }}
                        />
                    }
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        maxHeight: "50px",
                        borderRadius: 1,
                        fontWeight: 400,
                        fontSize: 15,
                        bgcolor: "#F8F8FA",
                        borderColor: "#E0E0E0",
                        color: "#222",
                        flex: 1,
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        "&:hover": {
                            bgcolor: "#F3EDFF",
                            borderColor: "#7B4AE2",
                            color: "#7B4AE2",
                        },
                    }}
                >
                    Bring Forward
                </Button>


                <Button
                    variant="outlined"
                    endIcon={
                        <img
                            src="/backward-icon.svg"
                            alt="Backward"
                            style={{ width: 20, height: 20 }}
                        />
                    }
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        maxHeight: "50px",
                        borderRadius: 1,
                        fontWeight: 400,
                        fontSize: 15,
                        bgcolor: "#F8F8FA",
                        borderColor: "#E0E0E0",
                        color: "#222",
                        flex: 1,
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        "&:hover": {
                            bgcolor: "#F3EDFF",
                            borderColor: "#7B4AE2",
                            color: "#7B4AE2",
                        },
                    }}
                >
                    Send Backward
                </Button>
            </Box>

            {/* Reset Button */}
            <Box sx={{ px: 3, pb: 3, pt: 2 }}>
                <Button
                    fullWidth
                    sx={{
                        bgcolor: "linear-gradient(90deg, #7B4AE2 0%, #5F2EEA 100%)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 18,
                        borderRadius: 8,
                        py: 1.5,
                        textTransform: "none",
                        boxShadow: "0 2px 8px 0 rgba(123,74,226,0.15)",
                        background: "linear-gradient(90deg, #7B4AE2 0%, #5F2EEA 100%)",
                        "&:hover": {
                            background: "linear-gradient(90deg, #5F2EEA 0%, #7B4AE2 100%)",
                        },
                    }}
                >
                    Reset
                </Button>
            </Box>
        </Box>
    );
};

export default ImageSettingsPanel; 