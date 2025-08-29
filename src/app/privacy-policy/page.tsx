"use client"
import React from "react";
import { Box, Typography, Container } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <Box
      sx={{ bgcolor: "white", minHeight: "100vh", fontFamily: "sans-serif" }}
    >
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #3b0cff, #6a00ff)",
          color: "white",
          pb: { xs: 8, md: 10 },
        }}
      >
        {/* Top Bar with Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: { xs: 2, md: 4 },
            py: 2,
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <Image
              src="/images/Logo white.svg"
              alt="Slidexy Logo"
              width={118}
              height={36}
            />
          </Link>
        </Box>

        {/* Centered Heading */}
        <Box sx={{ textAlign: "center", mt: { xs: 4, md: 6 } }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 1, fontSize: { xs: 28, md: 36 } }}
          >
            Terms of Service
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Last updated and effective date: September 2025
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="body1" sx={{ mb: 6, color: "grey.700" }}>
          Please read these Terms of Service (“Agreement” or “Terms”) carefully.
          Your use or access of the Slidexy Platform (as defined below)
          constitutes your consent to this Agreement. If you do not agree, do
          not use the Platform or Services.
        </Typography>

        {/* Section: General Terms */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 3, color: "grey.900" }}
        >
          General Terms and Conditions for Users and Subscribers
        </Typography>

        {/* Section: Description */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "grey.900" }}
        >
          Description of the Platform and Services
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          Slidexy provides proprietary AI-powered software designed to generate
          and edit presentations. The platform assists users in transforming
          various inputs into professional-quality slides with minimal effort.
          Current features include:
        </Typography>
        <ul
          style={{
            marginLeft: "1.5rem",
            marginBottom: "1.5rem",
            color: "#555",
          }}
        >
          <li>
            <strong>Prompt to Deck:</strong> Generate full slide decks from text
            prompts.
          </li>
          <li>
            <strong>Video to Deck:</strong> Convert video content into
            structured presentation slides.
          </li>
          <li>
            <strong>Website to Deck:</strong> Summarize and transform websites
            into presentation-ready slides.
          </li>
          <li>
            <strong>Text to Template:</strong> Turn raw text into polished slide
            templates.
          </li>
        </ul>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          In addition, Slidexy offers tools for customizing, editing, and
          collaborating on slides to streamline the entire presentation creation
          workflow.
        </Typography>

        {/* Section: General Agreement */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "grey.900" }}
        >
          General Agreement
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          By accessing or using the Platform or Services, you agree to be bound
          by these Terms and our Privacy Policy. You represent that you are at
          least 18 years of age or have legal guardian consent.
        </Typography>

        {/* Section: User Accounts */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "grey.900" }}
        >
          User and Subscriber Accounts
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          Some areas of the Platform require registration. You are responsible
          for maintaining the confidentiality of your login credentials and all
          activities under your account. You must notify us immediately of any
          unauthorized use.
        </Typography>

        {/* Section: Electronic Signatures */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "grey.900" }}
        >
          Electronic Signatures
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          By using the Platform, you consent to use electronic signatures,
          contracts, and communications where permitted by law.
        </Typography>

        {/* Section: Invitations */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "grey.900" }}
        >
          Invitations
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          You may invite others to access shared spaces on the Platform. You are
          responsible for verifying invitee access levels and for all activity
          resulting from your invitations.
        </Typography>

        {/* Section: Subscriptions and Payments */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "grey.900" }}
        >
          Subscriptions and Payments
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          Certain features of the Platform may require paid subscriptions. Fees
          are billed in advance and are non-refundable except as required by
          law. You authorize recurring billing until you cancel your
          subscription.
        </Typography>

        {/* Section: Acceptable Use Policy */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "grey.900" }}
        >
          Acceptable Use Policy
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          You agree not to misuse the Platform, including but not limited to:
          reverse engineering, reselling access, uploading harmful content, or
          using the Services to generate unlawful material.
        </Typography>

        {/* Section: Intellectual Property */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "grey.900" }}
        >
          Intellectual Property
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          Slidexy and its licensors own all rights, title, and interest in and
          to the Platform, including software, branding, and generated
          templates. Users retain rights to their own uploaded content.
        </Typography>

        {/* Section: Termination */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "grey.900" }}
        >
          Termination
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          We may suspend or terminate your account if you violate these Terms.
          Upon termination, your right to use the Platform ceases immediately.
        </Typography>

        {/* Section: Limitation of Liability */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "grey.900" }}
        >
          Limitation of Liability
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          To the maximum extent permitted by law, Slidexy is not liable for any
          indirect, incidental, or consequential damages arising from your use
          of the Platform.
        </Typography>

        {/* Section: Governing Law */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "grey.900" }}
        >
          Governing Law
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          These Terms shall be governed by and construed under the laws of your
          country of residence, unless otherwise required by law.
        </Typography>

        {/* Section: Changes to Terms */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "grey.900" }}
        >
          Changes to Terms
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "grey.700" }}>
          We may update these Terms from time to time. Continued use of the
          Platform after changes are posted constitutes acceptance of the
          revised Terms.
        </Typography>
      </Container>
    </Box>
  );
}
