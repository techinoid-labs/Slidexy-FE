"use client";
import {
  Box,
  Stack,
  Typography,
  Button,
  InputBase,
  Paper,
  Snackbar,
  Alert,
  Link as NavLink,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ smooth fade
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const videoData = [
  {
    src: "/images/gif1.mp4",
    title: "Generate Your Deck Instantly with Slidexy AI",
  },
  {
    src: "/images/gif2.mp4",
    title: "Generate Slides Instantly with Slidexy AI",
  },
  { src: "/images/gif3.mp4", title: "Content Re-Generation" },
  { src: "/images/gif4.mp4", title: "Re-generate Images Instantly" },
  {
    src: "/images/gif5.mp4",
    title: "Generate Infographics Instantly with Slidexy AI",
  },
  { src: "/images/gif6.mp4", title: "Slidexy AI Assistant" },
];

export default function WaitingList() {
  const [email, setEmail] = React.useState("");

  const [currentVideo, setCurrentVideo] = useState(0);

  const handleEnded = () => {
    setCurrentVideo((prev) => (prev + 1) % videoData.length);
  };

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const handleClose = () => setOpen(false);

  const handleJoin = async () => {
    if (!email) {
      setMessage("Please enter an email");
      setSeverity("error");
      setOpen(true);
      return;
    }
  };

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", overflowX: "hidden" }}>
      {/* Header Section */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        sx={{
          p: { xs: 3, sm: 6, md: "60px" },
          gap: { xs: 3, sm: 0 },
          flexWrap: "wrap",
        }}
      >
        {/* Logo */}
        <Link href="/" passHref>
          <Box
            sx={{
              mb: { xs: 2, sm: 0 },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Image
              src="/images/Logo.svg"
              alt="Slides Logo"
              width={218}
              height={136}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        </Link>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          {[
            {
              src: "/images/social-ico/facebook-ico.svg",
              alt: "Facebook",
              link: "https://web.facebook.com/Slidexy",
            },
            // {
            //   src: "/images/x-icon.svg",
            //   alt: "Twitter",
            //   link: "https://web.facebook.com/Slidexy",
            // },
            {
              src: "/images/social-ico/instagram-ico.svg",
              alt: "Instagram",
              link: "https://www.instagram.com/slidexy_ai/",
            },
            {
              src: "/images/social-ico/linkedin-ico.svg",
              alt: "linkedin",
              link: "https://www.linkedin.com/company/slidexy/",
            },
            {
              src: "/images/social-ico/tiktok-ico.svg",
              alt: "tiktok",
              link: "https://www.tiktok.com/@slidexy_ai",
            },
          ].map((icon, idx) => (
            <NavLink
              key={idx}
              href={icon.link}
              target="_blank"
              underline="none"
            >
              <img
                src={icon.src}
                alt={icon.alt}
                width={25}
                height={25}
                className="object-cover hover:p-[20px] hover:bg-[#E8E4FF] rounded-full"
                style={{ display: "block", cursor: "pointer" }}
              />
            </NavLink>
          ))}
        </Stack>
      </Box>

      {/* Content Section */}
      <Box sx={{ backgroundColor: "#FFFFFF", py: { xs: 6, md: 5 } }}>
        <Box
          sx={{
            maxWidth: "1400px",
            mx: "auto",
            borderRadius: "30px",
            backgroundColor: "white",
            px: { xs: 2, sm: 4, md: 10 },
            pb: 0,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={{ xs: 4, md: 6 }}
          >
            {/* Left Column */}
            <Stack
              spacing={3}
              flex={1}
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              <Typography
                variant="h4"
                fontWeight={600}
                sx={{
                  fontSize: { xs: "24px", sm: "28px", md: "36px" },
                  lineHeight: 1.2,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                {videoData[currentVideo].title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  maxWidth: "580px",
                  fontSize: { xs: "16px", md: "18px" },
                  color: "text.secondary",
                  mx: { xs: "auto", md: 0 },
                }}
              >
                You can enjoy the above benefits and so much more in one
                platform. Click the button below to join waitlist
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                  width: "100%",
                }}
              >
                <Button
                  onClick={() => {
                    const section =
                      document.getElementById("waitingListSection");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  variant="contained"
                  size="large"
                >
                  Join Waitlist
                  <Box
                    component="img"
                    src="/images/forwardArrow.svg"
                    alt="Arrow Right"
                    sx={{ width: 16, height: 16, ml: 1 }}
                  />
                </Button>
              </Box>

              <Box sx={{ marginTop: "10px" }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap", // makes it wrap nicely if too many dots
                    justifyContent: { xs: "center", md: "left" },
                  }}
                >
                  {videoData.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentVideo(index)}
                      sx={{
                        width: { xs: "16px", sm: "16px" },
                        height: { xs: "6px", sm: "6px" },
                        p: { sm: "4px" },
                        borderRadius: "10px",
                        cursor: "pointer",
                        backgroundColor:
                          index === currentVideo ? "blue" : "rgba(0,0,0,0.3)",
                        transition: "background-color 0.3s",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Stack>

            <Box
              sx={{
                display: "inline-block",
                borderRadius: "24px",
                p: { xs: 2, sm: 3 },
                maxWidth: "100%",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  width: "100%",
                  position: "relative", // so dots can be positioned
                }}
              >
                {/* Video */}
                <AnimatePresence mode="wait">
                  <motion.video
                    key={currentVideo}
                    src={videoData[currentVideo].src}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onEnded={handleEnded}
                    style={{
                      display: "block",
                      maxWidth: "560px",
                      height: "auto",
                      width: "100%",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>

                {/* Dots navigation */}
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Footer Section */}
      <div id="waitingListSection">
        <Box
          sx={{
            pb: { xs: "40px", md: "60px" },
            textAlign: { xs: "center", md: "center" },
            background: "#F9F9FB",
            marginTop: { xs: "40px", sm: "80px" },
            paddingTop: { xs: "60px", sm: "80px" },
          }}
        >
          {/* Coming Soon Tag */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 2, md: 1 },
              mb: 2,
            }}
          >
            <Box
              display="inline-flex"
              alignItems="center"
              sx={{
                px: 1.5,
                py: 0.7,
                fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
                borderRadius: "600px",
                color: "black",
                background: "white",
              }}
            >
              <Image
                src="/images/side-star-purple.svg"
                alt="Icon"
                width={18}
                height={18}
                style={{ marginRight: "6px" }}
              />
              <Typography
                component="span"
                // color="#4A00E0"
                sx={{ fontSize: "inherit", fontWeight: 500 }}
              >
                COMING SOON
              </Typography>
            </Box>
          </Box>

          {/* Main Heading */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 28, sm: 34, md: 50 },
              fontWeight: 550,
              mb: 3,
              lineHeight: 1.3,
              color: "#000000",
              px: { xs: 2, sm: 0 },
            }}
          >
            Unleash Your Imagination. <br />
            <Typography
              variant="inherit"
              component="span"
              sx={{ fontWeight: 300 }}
            >
              Create Without Limits.
            </Typography>
          </Typography>

          {/* Subheading */}
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mx: "auto",
              lineHeight: 1.4,
              fontSize: { xs: "14px", sm: "15px", md: "16px" },
              maxWidth: 600,
              px: 2,
            }}
          >
            The tool artists, designers, and dreamers have been waiting for
          </Typography>

          {/* Email Input */}
          <Box
            component="form"
            sx={{
              maxWidth: { xs: "100%", sm: "730px" },
              mx: "auto",
              px: { xs: 2, sm: 2 },
              py: { xs: 3, sm: 4 },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: { xs: "8px", sm: "10px" },
                borderRadius: "40px",
                // border: "1px solid",
                // borderColor: "#4A00E0",
                bgcolor: "#fff",
                flexWrap: "wrap", // keeps button below on xs
                pl: { sm: "32px", xs: "20px" },
              }}
            >
              <InputBase
                type="email"
                placeholder="Type email address here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  flex: 1,
                  fontSize: { xs: 14, sm: 16 },
                  minWidth: { xs: "100px", sm: "180px" },
                }}
              />
              <Button
                variant="contained"
                sx={{ width: { xs: "auto", sm: "fit-content" } }}
                onClick={async () => {
                  if (!email) {
                    setMessage("Please enter an email");
                    setSeverity("error");
                    setOpen(true);
                    return;
                  }
                  try {
                    const res = await fetch(`${API_BASE_URL}/join-waitlist`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    });

                    const data = await res.json();
                    if (res.ok) {
                      setMessage("You have joined the waitlist!");
                      setSeverity("success");
                      setEmail("");
                    } else {
                      setMessage(data.error || "Something went wrong");
                      setSeverity("error");
                    }
                  } catch (err) {
                    setMessage("Server error");
                    setSeverity("error");
                  }
                  setOpen(true);
                }}
              >
                Join the Waitlist
                <Box
                  component="img"
                  src="/images/whiteArrow.svg"
                  alt="Arrow Right"
                  sx={{ width: 16, height: 16, ml: 1 }}
                />
              </Button>
            </Paper>
          </Box>

          <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleClose}
              severity={severity}
              sx={{ width: "100%" }}
              variant="filled"
            >
              {message}
            </Alert>
          </Snackbar>

          {/* Trusted Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "center",
              mt: 3,
              mb: 2,
              gap: 0.1,
            }}
          >
            {/* Avatars */}
            <Stack direction="row" spacing={-1}>
              <Image
                src="/images/waitlist/trusted-waitlist.svg"
                alt="User 1"
                width={32}
                height={32}
                style={{ borderRadius: "50%", border: "2px solid #fff" }}
              />
              <Image
                src="/images/waitlist/trusted-waitlist.svg"
                alt="User 2"
                width={32}
                height={32}
                style={{ borderRadius: "50%", border: "2px solid #fff" }}
              />
              <Image
                src="/images/waitlist/trusted-waitlist.svg"
                alt="User 3"
                width={32}
                height={32}
                style={{ borderRadius: "50%", border: "2px solid #fff" }}
              />
            </Stack>

            {/* Trusted Text */}
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "14px", sm: "15px" },
                color: "text.secondary",
                ml: { xs: 0, sm: 1 },
                mt: { xs: 1, sm: 0 },
              }}
            >
              Trusted by 10k+ people
            </Typography>
          </Box>

          {/* Social Icons */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            {[
              {
                src: "/images/social-ico/facebook-ico.svg",
                alt: "Facebook",
                link: "https://web.facebook.com/Slidexy",
              },
              // {
              //   src: "/images/x-icon.svg",
              //   alt: "Twitter",
              //   link: "https://web.facebook.com/Slidexy",
              // },
              {
                src: "/images/social-ico/instagram-ico.svg",
                alt: "Instagram",
                link: "https://www.instagram.com/slidexy_ai/",
              },
              {
                src: "/images/social-ico/linkedin-ico.svg",
                alt: "linkedin",
                link: "https://www.linkedin.com/company/slidexy/",
              },
              {
                src: "/images/social-ico/tiktok-ico.svg",
                alt: "tiktok",
                link: "https://www.tiktok.com/@slidexy_ai",
              },
            ].map((icon, idx) => (
              <NavLink
                key={idx}
                href={icon.link}
                target="_blank"
                underline="none"
              >
                <img
                  src={icon.src}
                  alt={icon.alt}
                  width={25}
                  height={25}
                  className="object-cover hover:p-[20px] hover:bg-[#E8E4FF] rounded-full"
                  style={{ display: "block", cursor: "pointer" }}
                />
              </NavLink>
            ))}
          </Stack>
        </Box>
      </div>
    </Box>
  );
}
