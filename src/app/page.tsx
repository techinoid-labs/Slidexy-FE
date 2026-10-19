import HomeClient from "./components/HomeClient";

export default function Home() {
  return (
    <>
      {/* Accessible sr-only H1 for SEO — visible H1 is rendered by HeroSection */}
      <h1
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
      >
        AI Presentation Maker for Slides and Pitch Decks
      </h1>
      <p
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
      >
        SlideXY is the AI presentation maker that turns your ideas into
        professional slide decks in seconds. Whether you are a startup founder
        building a pitch deck, a sales team preparing a quarterly review, or an
        educator crafting lesson slides, SlideXY handles the design so you can
        focus on your message. Paste a prompt, upload a video, drop in a website
        link, or speak your ideas aloud. Slidexy creates polished, on-brand
        presentations instantly. No design skills needed. No templates to wrestle
        with. Just your content, beautifully presented.
      </p>

      <HomeClient />
    </>
  );
}

