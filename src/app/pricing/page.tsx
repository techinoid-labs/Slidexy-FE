import type { Metadata } from "next";
import { Box, Container, Typography } from "@mui/material";
import Header from "@/app/components/headers-navbar/Header";
import Footer from "@/app/components/home/Footer";
import PricingSection from "../components/pricing/Pricing";
import FaqList from "../components/home/FaqList";
import {
  BONE,
  BONE_DEEP,
  Display,
  INK,
  Lede,
  MONO,
  MUTED,
  RULE,
  SectionHead,
} from "../components/home/editorial";

export const metadata: Metadata = {
  title: "Pricing | Slidexy",
  description:
    "Plans for Slidexy. Start free, keep the file you make, and pay only when the output is good enough for your work.",
  alternates: { canonical: "https://slidexy.ai/pricing" },
};

/**
 * Pricing.
 *
 * The old page was a centred headline, three paragraphs of marketing
 * prose, a divider, a persona grid, a rich-text SEO block and an FAQ,
 * each in a slightly different style. It said very little at
 * considerable length.
 *
 * This keeps the plan table, says what is true in as few words as
 * possible, and gives the page the one thing a pricing page is actually
 * for: answering the objection that stops someone buying. The questions
 * open in place rather than sending anyone to a help centre.
 */

const INCLUDED = [
  ["Editable PowerPoint", "Real text boxes, tables and charts on every plan, free included."],
  ["Every template", "No tier holds a design back. The difference between plans is volume."],
  ["Your first deck free", "No card, no account. Judge the output before you pay for it."],
  ["Cancel in one click", "From your account settings. You keep access to the end of the period."],
];

const FAQS = [
  {
    q: "How do credits work?",
    a: "One credit builds one deck, whether you start from a sentence, a document or a link. Rewriting a line, restyling the deck or exporting it again costs nothing. Credits refresh on your billing date and do not roll over.",
  },
  {
    q: "What happens when I run out?",
    a: "Nothing you have made goes away. You keep every deck, can keep editing them and can keep exporting them. You just cannot build a new one until your credits refresh or you move up a plan.",
  },
  {
    q: "Is the PowerPoint export really editable?",
    a: "Yes, on every plan. Headlines come out as text boxes, tables as native tables and charts bound to their own data sheet. Open the file, click a number, change it. Most tools hand you one flat image per slide.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes, from your account settings, and you keep access until the end of the period you have paid for. Paid plans also carry a 7 day money back guarantee, no questions asked.",
  },
  {
    q: "Do you train on my decks?",
    a: "No. What you write and upload is used to build your deck and nothing else.",
  },
];

export default function PricingPage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: BONE,
        overflowX: "clip",
      }}
    >
      <Header />

      <Box sx={{ flex: "1 0 auto" }}>
        {/* The plan table carries its own heading and lede */}
        <Box sx={{ pt: { xs: 5, md: 8 } }}>
          <PricingSection />
        </Box>

        {/* What every plan includes, as a ruled spec list rather than a
            comparison matrix with ticks in it */}
        <Box component="section" sx={{ bgcolor: BONE_DEEP, py: { xs: 8, md: 11 }, mt: { xs: 7, md: 10 } }}>
          <Container maxWidth="lg">
            <SectionHead index="01" label="On every plan" />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.25fr 1fr" },
                gap: { xs: 3, md: 8 },
                alignItems: "end",
                mb: { xs: 4, md: 6 },
              }}
            >
              <Display>
                The cheap plan is not
                <br />
                the crippled one.
              </Display>
              <Lede sx={{ pb: 1 }}>
                Plans differ by how many decks you build, not by how good
                they are allowed to look.
              </Lede>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                borderTop: `1px solid ${INK}`,
              }}
            >
              {INCLUDED.map(([title, body], i) => (
                <Box
                  key={title}
                  sx={{
                    py: 3,
                    pr: { sm: 4 },
                    pl: { sm: i % 2 === 1 ? 4 : 0 },
                    borderBottom: `1px solid ${RULE}`,
                    borderRight: { xs: "none", sm: i % 2 === 0 ? `1px solid ${RULE}` : "none" },
                  }}
                >
                  <Typography sx={{ fontSize: "1.05rem", color: INK, mb: 0.75 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.92rem", lineHeight: 1.6, color: MUTED, maxWidth: 430 }}>
                    {body}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* The questions that actually stop people buying */}
        <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <SectionHead index="02" label="Before you pay" />

            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              <Display>Fair questions.</Display>
            </Box>

            <FaqList items={FAQS} />

            <Typography sx={{ mt: 4, fontSize: "0.9rem", color: "#9A94A6" }}>
              Still unsure? Build one deck free and judge it on your own
              material. It is the only test that counts.
            </Typography>
          </Container>
        </Box>

        {/* Closing line, in the same ink block the home page ends on */}
        <Box component="section" sx={{ pb: { xs: 8, md: 13 } }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                bgcolor: INK,
                color: "#fff",
                px: { xs: 3, md: 7 },
                py: { xs: 5, md: 6.5 },
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
                gap: { xs: 3, md: 6 },
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.7rem",
                    letterSpacing: "0.17em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)",
                    mb: 1.75,
                  }}
                >
                  No card for the first one
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: { xs: "1.7rem", md: "2.3rem" },
                    lineHeight: 1.06,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Try it on the deck you
                  <Box component="span" sx={{ display: "block", fontStyle: "italic", color: "#C9A6F2" }}>
                    actually have to give.
                  </Box>
                </Typography>
              </Box>

              <Box
                component="a"
                href="/tools/prompt-to-deck"
                sx={{
                  justifySelf: { md: "end" },
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.25,
                  bgcolor: "#fff",
                  color: INK,
                  px: 3,
                  py: 1.6,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s ease, color 0.15s ease",
                  "&:hover": { bgcolor: "#8E2DE2", color: "#fff" },
                }}
              >
                Start a deck
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
