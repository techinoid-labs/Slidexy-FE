"use client";
import {
  Box,
  Stack,
  Typography,
  Button,
  InputBase,
  Paper,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function WaitingList() {
  const [email, setEmail] = React.useState("");

  return (
    <Box sx={{ backgroundColor: "#f9f6ff", overflowX: "hidden" }}>
      {" "}
      {/* Prevent overflow */}
      {/* Header Section */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "center", sm: "center" }}
        sx={{
          p: { xs: 3, sm: 6, md: "60px" },
          gap: { xs: 3, sm: 0 },
          flexWrap: "wrap", // Ensures wrap if needed
        }}
      >
        <Box sx={{ mb: { xs: 2, sm: 0 } }}>
          <Image
            src="/images/Logo.svg"
            alt="Slides Logo"
            width={118}
            height={36}
          />
        </Box>

        <Stack
          direction="row"
          spacing={3}
          justifyContent={{ xs: "flex-start", sm: "center" }}
          alignItems="center"
          sx={{
            flexWrap: "wrap",
            mb: { xs: 0, sm: 3 },
          }}
        >
          {[
            { src: "/images/facebook-icon.svg", alt: "Facebook" },
            { src: "/images/x-icon.svg", alt: "Twitter" },
            { src: "/images/instagram.svg", alt: "Instagram" },
          ].map((icon, idx) => (
            <Link key={idx} href="#">
              <Box
                component="img"
                src={icon.src}
                alt={icon.alt}
                sx={{ width: 14, height: 14, display: "block" }}
              />
            </Link>
          ))}
        </Stack>
      </Box>
      {/* Content Section */}
      <Box sx={{ backgroundColor: "#f9f6ff", py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            maxWidth: "1300px",
            mx: "auto",
            borderRadius: "30px",
            backgroundColor: "white",
            px: { xs: 3, sm: 4, md: 10 },
            paddingTop: "120px",
            pb: 0,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={{ xs: 4, md: 6 }}
          >
            {/* Left Column */}
            <Stack spacing={3} flex={1}>
              <Typography
                variant="h4"
                fontWeight={600}
                sx={{
                  fontSize: { xs: "24px", sm: "28px", md: "36px" },
                  lineHeight: 1.2,
                  textAlign: { xs: "center", md: "left" }, // Center text on small screens
                }}
              >
                Generate Slides Instantly with Slidexy AI
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  maxWidth: "580px",
                  fontSize: { xs: "16px", md: "18px" },
                  color: "text.secondary",
                  textAlign: { xs: "center", md: "left" },
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
                }}
              >
                <Button
                  variant="contained"
                  onClick={async () => {
                    if (!email) {
                      alert("Please enter an email");
                      return;
                    }
                    try {
                      const res = await fetch(
                        "http://localhost:5000/join-waitlist",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email }),
                        }
                      );

                      const data = await res.json();
                      if (res.ok) {
                        alert("You have joined the waitlist!");
                        setEmail("");
                      } else {
                        alert(data.error || "Something went wrong");
                      }
                    } catch (err) {
                      console.error(err);
                      alert("Server error");
                    }
                  }}
                >
                  Join the Wishlist
                  <Box
                    component="img"
                    src="/images/whiteArrow.svg"
                    alt="Arrow Right"
                    sx={{ width: 16, height: 16, ml: 1 }}
                  />
                </Button>
              </Box>
            </Stack>

            {/* Right Column */}
            <Box
              sx={{
                display: "inline-block",
                backgroundColor: "#642cd6",
                borderRadius: "24px",
                paddingTop: "17px",
                paddingLeft: "24px",
                maxWidth: "100%",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                <Image
                  src="/images/PresentationPreview.svg"
                  alt="Waiting List Illustration"
                  width={600}
                  height={400}
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
      {/* Footer Section */}
      <Box sx={{ pb: "30px", textAlign: "center" }}>
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
              fontSize: { xs: "0.8rem", md: "0.95rem" },
              borderRadius: "600px",
              color: "#4A00E0",
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
              sx={{ fontSize: "inherit", fontWeight: 500 }}
            >
              COMING SOON
            </Typography>
          </Box>
        </Box>

        {/* Main Heading */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 30, md: 50 },
            fontWeight: 550,
            mb: 4,
            lineHeight: 1.3,
            color: "#000000",
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
            lineHeight: 1.3,
            fontSize: { xs: "16px", md: "16px" },
            maxWidth: 600,
            px: 2,
          }}
        >
          The tool artists, designers, and dreamers have been waiting for
          powered by AI, styled by designers.
        </Typography>

        {/* Email Input */}
        <Box
          component="form"
          sx={{
            width: "100%",
            maxWidth: 560,
            mx: "auto",
            px: { xs: 2, sm: 2 },
            py: 4,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              padding: { sm: "10px", xs: "10px" },
              borderRadius: "40px",
              border: "1px solid",
              borderColor: "#E6E6EB",
              bgcolor: "#fff",
              flexWrap: "wrap", // Wrap button on small screens
            }}
          >
            <InputBase
              type="email"
              placeholder="Type email address here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ flex: 1, fontSize: { xs: 14, sm: 16 }, minWidth: 180 }}
            />
            <Button
              variant="contained"
              sx={{
                px: "20px",
                py: "14px",
                textTransform: "none",
                fontSize: { xs: "14px", md: "16px" },
                fontWeight: 500,
                borderRadius: "30px",
                background: "#8E2DE2",
                color: "white",
                width: { xs: "100%", sm: "fit-content" },
              }}
              onClick={async () => {
                if (!email) {
                  alert("Please enter an email");
                  return;
                }
                try {
                  const res = await fetch(
                    "http://localhost:5000/join-waitlist",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    }
                  );

                  const data = await res.json();
                  if (res.ok) {
                    alert("You have joined the waitlist!");
                    setEmail("");
                  } else {
                    alert(data.error || "Something went wrong");
                  }
                } catch (err) {
                  console.error(err);
                  alert("Server error");
                }
              }}
            >
              Join the Wishlist
              <Box
                component="img"
                src="/images/whiteArrow.svg"
                alt="Arrow Right"
                sx={{ width: 16, height: 16, ml: 1 }}
              />
            </Button>
          </Paper>
        </Box>

        {/* Trusted By */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {[
            "/images/Ellipse5.svg",
            "/images/Ellipse6.svg",
            "/images/Ellipse7.svg",
          ].map((img) => (
            <Box
              key={img}
              component="img"
              src={img}
              sx={{ width: 25, borderRadius: "50%" }}
            />
          ))}
          <Typography variant="h5" sx={{ fontSize: "16px", color: "#6D6D6D" }}>
            Trusted by 10k+ people
          </Typography>
        </Box>

        {/* Social Icons */}
        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          alignItems="center"
          mt={5}
          flexWrap="wrap"
        >
          {[
            { src: "/images/facebook-icon.svg", alt: "Facebook" },
            { src: "/images/x-icon.svg", alt: "Twitter" },
            { src: "/images/instagram.svg", alt: "Instagram" },
          ].map((icon, idx) => (
            <Link key={idx} href="#">
              <Box
                component="img"
                src={icon.src}
                alt={icon.alt}
                sx={{ width: 14, height: 14 }}
              />
            </Link>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
