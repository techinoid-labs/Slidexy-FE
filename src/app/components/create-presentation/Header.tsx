"use client"

import React from "react"
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme as useMuiTheme,
} from "@mui/material"
import { KeyboardArrowDown, Menu as MenuIcon } from "@mui/icons-material"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/lib/theme-toggle"
import { Typography } from "@mui/material"

export default function Header() {
    const theme = useMuiTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const navigationItems = [
        { label: "Templates", hasDropdown: true },
        { label: "Features", hasDropdown: true },
        { label: "Reports", hasDropdown: false },
        { label: "Product", hasDropdown: false },
        { label: "Blog", hasDropdown: false },
    ]

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: "#fff",
                minHeight: 80,
                boxShadow: 'none',
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: "text.primary",
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", alignItems: 'center', px: { xs: 6, md: 8 }, minHeight: 64, mt: 1, }}>
                {/* Logo */}
                <Link href="/" style={{ textDecoration: "none" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Image src="/images/icon.png" alt="Slides Logo" width={44} height={44} />
                    </Box>
                </Link>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 5, height: '100%' }}>
                        {navigationItems.map((item) => (
                            <Button
                                key={item.label}
                                color="inherit"
                                endIcon={item.hasDropdown ? <KeyboardArrowDown /> : null}
                                sx={{
                                    color: "text.secondary",
                                    fontSize: '1.35rem',
                                    fontWeight: 500,
                                    letterSpacing: 1,
                                    px: 3,
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    "&:hover": {
                                        color: "text.primary",
                                        backgroundColor: "transparent",
                                    },
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                )}

                {/* Right Side Actions */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!isMobile && (
                        <>
                            <Typography
                                sx={{
                                    mt: 0.5,
                                    color: "#4A00E0",
                                    fontWeight: 500,
                                    fontSize: "2 rem",
                                    cursor: "pointer",
                                    display: "inline-block",
                                    px: 2,
                                    py: 1,
                                    lineHeight: 1.1,
                                    borderRadius: "999px",
                                    transition: "background-color 0.2s ease-in-out, transform 0.2s ease-in-out",
                                    "&:hover": {
                                    },
                                }}
                            >
                                Login
                            </Typography>

                            {/* Try for Free button */}
                            <Button
                                variant="contained"
                                sx={{
                                    mt: 0.5,
                                    backgroundColor: "#4A00E0",
                                    color: "#fff",
                                    borderRadius: "999px",
                                    px: 3,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                    "&:hover": {
                                        backgroundColor: "#3a00b8",
                                    },
                                }}
                            >
                                Try for Free →
                            </Button>
                        </>
                    )}

                    {/* Mobile Menu */}
                    {isMobile && (
                        <>
                            <IconButton color="inherit" onClick={handleMenuOpen} aria-label="menu">
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        minWidth: 200,
                                    },
                                }}
                            >
                                {navigationItems.map((item) => (
                                    <MenuItem key={item.label} onClick={handleMenuClose}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                                <MenuItem onClick={handleMenuClose}>Login</MenuItem>
                                <MenuItem onClick={handleMenuClose}>Try for Free</MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}
