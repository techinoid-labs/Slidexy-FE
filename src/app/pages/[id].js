import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import TemplateNavBar from "@/components/TemplateNavBar";
import UpperNavBar from "@/components/UpperNavBar";
import LoginModal from "@/components/LoginModal";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";

const PresentationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [presentation, setPresentation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { setSelectedImage, setSelectedImageIndex, setSelectedShapeIndex, setSelectedTextId } = useSlides();
  const { setSelectedLayout, setSelectedTheme } = useSlideThemeContext();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    if (id) {
      const fetchPresentation = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/presentations/${id}`);
          setPresentation(response.data);
        } catch (err) {
          setError("Failed to load presentation.");
        } finally {
          setLoading(false);
        }
      };
      fetchPresentation();
    }
  }, [id]);

  const handlePreview = () => {
    console.log("Preview triggered");
    // Implement preview logic
  };

  const handleOpenThemePanel = () => {
    console.log("Open theme panel triggered");
    // Implement theme panel logic
  };

  const handleClearCanvas = () => {
    console.log("Clear canvas triggered");
    setSelectedImage(null);
    setSelectedImageIndex(null);
    setSelectedShapeIndex(null);
    setSelectedTextId(null);
    setSelectedLayout(null);
    setSelectedTheme(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!presentation) return null;

  return (
    <div style={{ paddingTop: 80 }}>
      <TemplateNavBar />
      <UpperNavBar
        onExportPDF={() => console.log("PDF export triggered")} // Handled in UpperNavBar
        onExportPPT={() => console.log("PPTX export triggered")} // Handled in UpperNavBar
        onClearCanvas={handleClearCanvas}
        onPreview={handlePreview}
        onOpenThemePanel={handleOpenThemePanel}
      />
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>{presentation.title}</h2>
        <div style={{ border: "1px solid #e0e0e0", padding: "16px", borderRadius: "8px" }}>
          {presentation.content}
        </div>
      </div>
      <LoginModal />
    </div>
  );
};

export default PresentationPage;