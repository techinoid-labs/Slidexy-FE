import type { Metadata } from "next";
import Header from "@/app/components/headers-navbar/Header";
import Footer from "@/app/components/home/Footer";
import CommunitySection from "@/app/components/home/Community";
import PromptToProposal from "./components/promptToProposal";
import { Box, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Prompt to Proposal — AI Proposal Generator",
  description:
    "Create professional business proposals from a text prompt. SlideXY AI generates structured proposals with executive summaries, timelines, and deliverables.",
  alternates: {
    canonical: "https://slidexy.ai/tools/prompt-to-proposal",
  },
};

export default function Page() {
  return (
    <>
      <Header />
      <Box
        component="section"
        sx={{
          textAlign: "center",
          pt: { xs: 4, md: 6 },
          px: { xs: 3, md: 6 },
          maxWidth: 720,
          mx: "auto",
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            color: "#111827",
            mb: 1.5,
          }}
        >
          Prompt to Proposal
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Enter your project details and SlideXY AI builds a complete
          business proposal with executive summary, scope of work,
          timeline, deliverables, and pricing. Win more clients with
          professionally structured proposals generated in seconds
          instead of hours.
        </Typography>
      </Box>
      <PromptToProposal />
      <CommunitySection />
      <Footer />
    </>
  );
}