import HomeClient from "./components/HomeClient";

export default function Home() {
  return (
    <>
      <h1
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          height: 1,
          width: 1,
          overflow: "hidden",
        }}
      >SlideXy AI Turns Your Ideas into Stunning Presentations Instantly</h1>
      <p
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          height: 1,
          width: 1,
          overflow: "hidden",
        }}
      >
        Create slides instantly using AI. Turn ideas, voice, text, or links into
        polished presentations in seconds.
      </p>

      <HomeClient />
    </>
  );
}
