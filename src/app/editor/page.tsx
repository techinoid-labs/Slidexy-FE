"use client";
import React, { useRef, useState, useEffect } from "react";
import SideNavBar from "../components/modify-presentation/Side-NavBar";
import UpperNavBar from "../components/modify-presentation/Upper-NavBar";
import ThemePanel from "../components/modify-presentation/ThemePallete";
import SlideEditor from "./SlideEditor";
import { useSlides } from "@/app/context/SlidesContext";
import { useDispatch } from "react-redux";
import { setSlides as setSlidesAction } from "@/app/slice/slidesSlice";
import { useRouter } from "next/navigation";
import { exportSlidesAsPDF } from "@/utils/exportSlides";
import { exportSlidesAsPPT } from "@/utils/exportSlidesAsPPT";
import { exportBlockDeckAsPPT } from "@/utils/exportBlockDeckAsPPT";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import ImageSettingsPanel from "../components/modify-presentation/ImagePanel";
import TextSettingsPanel from "@/app/components/modify-presentation/TextPanel";
import ShapeSettingsPanel from "@/app/components/modify-presentation/ShapePanel";
import { useTheme, useMediaQuery } from "@mui/material";
import LowerNavbarMobile from "../components/modify-presentation/Lower-Navbar-Mobile";
import SlideEditorMobile from "./SlideEditor-NewMobile";
import ImageSettingsPanelMobile from "../components/new-ui/Image-Panel";
import TextSettingsPanelMobile from "@/app/components/new-ui/Text-Panel";
import ShapeSettingsPanelMobile from "@/app/components/modify-presentation/ShapePanelMobile";
import ThemePanelMobile from "../components/modify-presentation/ThemePalleteMobile";
import BlockThemePanel from "../components/modify-presentation/BlockThemePanel";
import { QUALITY_PRESETS, type ExportOptions } from "../components/modify-presentation/ExportMenu";
import { Box } from "@mui/material";
import SlideShowPlayer from "@/app/components/modify-presentation/Slide-Preview";
import EditorEmptyState from "@/app/components/modify-presentation/EditorEmptyState";
import { useSlideThemeContext } from "../context/ThemeContext";
import { useSession } from "next-auth/react";
import AuthModal from "../components/auth/AuthModal";
import { useTemplateSlides } from "../context/TemplateSlidesContext";
import { loadPresentation } from "@/utils/presentationApi";
import { useDeckAutosave } from "@/app/hooks/useDeckAutosave";
import { useUser } from "../context/AuthContext";
import { getRandomSlide } from "@/utils/slideUtils";
import { generateSlideVariants } from "@/utils/variantGenerator";
import { getSlideDimensions } from "@/utils/slideUtils";
import { SHELL } from "../components/modify-presentation/shellTheme";
import BlockInspector from "../components/modify-presentation/BlockInspector";
import { parseBlockElementId } from "@/templates/mutate";


const Page = () => {
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);

  const {
    slides,
    selectedSlideIndex,
    setSlides,
    setSelectedSlideIndex,
    setSelectedTextId,
    selectedTextId,
    selectedImageIndex,
    selectedImage,
    selectedImageId,
    selectedShapeIndex,
    setSelectedShapeId,
    setSelectedImageIndex,
    setSelectedImage,
    setSelectedImageId,
    isMobileImageSelected,
    setIsMobileImageSelected,
    setSelectedShapeIndex,
    selectedShapeId,
  } = useSlides();
  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const { presentationId } = useTemplateSlides();
  const dispatch = useDispatch();
  const router = useRouter();
  const [initialSlides] = useState(() => slides);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [zoomOverride, setZoomOverride] = useState<number | null>(null);
  const scale = zoomOverride ?? fitScale;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLGScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingPPTX, setIsExportingPPTX] = useState(false);
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken as string | undefined;
  const { user, loading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [deckTitle, setDeckTitle] = useState<string | null>(null);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    scope: "deck",
    quality: "standard",
  });
  // Autosave stays off until the server copy has landed, otherwise the
  // empty initial state would be written over the saved deck.
  const [deckLoaded, setDeckLoaded] = useState(false);

  // A deck opened without an id (started from a template) has nothing to
  // fetch, so it is ready immediately. Without this autosave stayed off and
  // the user got no indication their work was unsaved -- the worst case.
  useEffect(() => {
    if (!presentationId) setDeckLoaded(true);
  }, [presentationId]);
  const [hadSelection, setHadSelection] = useState(false);

  // Fetch presentation slides on mount or when presentationId changes
  useEffect(() => {
    if (presentationId) {
      const fetchPresentation = async () => {
        try {
          // Was a relative URL, which 404s: the API is a separate origin.
          const loaded = await loadPresentation(presentationId, accessToken);
          if (loaded) {
            if (loaded.title) setDeckTitle(loaded.title);
            let fetchedSlides = loaded.slides || [];

            // Block-template slides are already complete documents. Running
            // the legacy variant generator over them would overwrite their
            // content with Konva-era elements.
            const isBlockSlide = (sl: any) => !!sl?.blockSpec;

            // Only generate variants for slides that don't have them
            fetchedSlides = fetchedSlides.map((slide: any) => {
              if (isBlockSlide(slide)) return slide;
              if (slide.layouts && slide.layouts.length > 0) {
                return slide;
              }

              const newLayouts = generateSlideVariants(
                slide,
                selectedTheme || {
                  backgroundColor: '#fff',
                  primaryColor: '#000',
                  artPalette: ['#000', '#333', '#000', '#fff', '#fff']
                }
              );
              const savedVariantIndex = typeof slide.currentVariantIndex === 'number' ? slide.currentVariantIndex : 0;
              // Clamp to available layouts count so it never goes out of bounds
              const clampedVariantIndex = Math.min(savedVariantIndex, newLayouts.length - 1);
              const variantSlide = newLayouts[clampedVariantIndex] || newLayouts[0] || slide;
              return {
                ...slide,
                layouts: newLayouts,
                currentVariantIndex: clampedVariantIndex,
                slide_title: variantSlide.slide_title || slide.slide_title,
                subtitle: variantSlide.subtitle || slide.subtitle,
                background: variantSlide.background || slide.background,
                elements: variantSlide.elements || slide.elements,
              };
            });

            setSlides(fetchedSlides);
          }
          setDeckLoaded(true);
        } catch (error) {
          console.error("Failed to fetch presentation:", error);
          // Still enable autosave: the deck in IndexedDB is worth saving
          // once the network recovers.
          setDeckLoaded(true);
        }
      };
      fetchPresentation();
    }
  }, [presentationId, accessToken]); // token too: a private deck 404s without it

  useEffect(() => {
    if (slides.length > 0 && (selectedSlideIndex === undefined || selectedSlideIndex === -1)) {
      setSelectedSlideIndex(0);
    }
  }, [slides.length, selectedSlideIndex, setSelectedSlideIndex]);

  // Keeps the deck on the server. Debounced, coalesced, and a no-op while
  // signed out -- the status it returns is what the top bar shows.
  const activeTemplateId =
    (slides?.find((sl: any) => sl?.blockSpec?.templateId) as any)?.blockSpec?.templateId ?? null;
  const autosave = useDeckAutosave({
    presentationId: presentationId ?? null,
    slides,
    title: deckTitle,
    blockTemplateId: activeTemplateId,
    enabled: deckLoaded,
    // A template deck gets its server record on first save. Put the id in
    // the URL so a refresh reopens the saved deck instead of a blank one.
    onCreated: (id: string) => {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("pid", id);
        window.history.replaceState({}, "", url.toString());
      } catch {
        /* a failed URL rewrite must not break the save */
      }
    },
  });

  useEffect(() => {
    const hasSelection = selectedTextId !== null || selectedImageIndex !== null || selectedShapeIndex !== null;
    if (hasSelection) {
      setIsThemePanelOpen(false);
    }
  }, [selectedTextId, selectedImageIndex, selectedShapeIndex]);

  const resetAll = () => {
    dispatch(setSlidesAction(initialSlides));
    setSelectedImageId(null);
    setSelectedShapeId(null);
    setIsMobileImageSelected(false);
    setIsThemePanelOpen(false);
    setSelectedShapeIndex(null);
  };

  const handleClearCanvas = () => {
    if (selectedSlideIndex < 0 || selectedSlideIndex >= slides.length) return;

    console.log('[ClearCanvas] Starting canvas clear...');

    const newSlides = structuredClone(slides);
    const currentSlide = newSlides[selectedSlideIndex];

    const blankSlide = {
      ...currentSlide,
      slide_title: {
        konva_component: "Konva.Text",
        text: "",
        properties: {
          fontSize: 36,
          fontWeight: "700",
          fontFamily: "Raleway",
          fill: selectedTheme?.primaryColor || "#000",
          fontStyle: "normal",
          align: "center",
          x: 25,
          y: 40,
          width: 800,
          height: 0,
        },
      },
      subtitle: undefined,
      elements: [],
      image_url: "",
      image_placeholder: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    };

    const freshLayouts = generateSlideVariants(blankSlide, selectedTheme);
    blankSlide.layouts = freshLayouts;
    blankSlide.currentVariantIndex = 0;

    newSlides[selectedSlideIndex] = blankSlide;
    setSlides(newSlides);

    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setSelectedShapeIndex(null);
    setIsMobileImageSelected(false);

    console.log('[ClearCanvas] Canvas cleared successfully');
  };

  const handleExportPDF = async () => {
    if (loading) return;
    if (session?.user || user) {
      setShowAuthModal(false);
      setIsExportingPDF(true);
      try {
        const preset = QUALITY_PRESETS[exportOptions.quality];
        const subset =
          exportOptions.scope === "current" && slides[selectedSlideIndex]
            ? [slides[selectedSlideIndex]]
            : slides;
        await exportSlidesAsPDF(subset, selectedTheme, {
          scale: preset.scale,
          jpegQuality: preset.jpegQuality,
        });
      } catch (err) {
        console.error("PDF Export failed:", err);
      } finally {
        setIsExportingPDF(false);
      }
    } else {
      setShowAuthModal(true);
    }
  };

  const handleExportPPTX = async () => {
    if (loading) return;
    if (session?.user || user) {
      setShowAuthModal(false);
      setIsExportingPPTX(true);
      try {
        // A deck of block slides exports as real PowerPoint objects --
        // editable text, tables and charts. Legacy decks have no structure
        // to work from, so they keep the picture-per-slide path.
        const subset =
          exportOptions.scope === "current" && slides[selectedSlideIndex]
            ? [slides[selectedSlideIndex]]
            : slides;
        const hasBlockSlides = subset.some((sl: any) => !!sl?.blockSpec);
        if (hasBlockSlides) {
          const res = await exportBlockDeckAsPPT(subset, selectedTheme);
          if (!res.ok) {
            console.warn("[PPTX] native export produced nothing; falling back");
            await exportSlidesAsPPT(subset, selectedTheme);
          }
        } else {
          await exportSlidesAsPPT(subset, selectedTheme);
        }
      } catch (err) {
        console.error("PPTX Export failed:", err);
      } finally {
        setIsExportingPPTX(false);
      }
    } else {
      setShowAuthModal(true);
    }
  };

  // Derived selection flags - simplified and unified
  const isTextSelected = !!selectedTextId;

  // Block-template slides have their own property panel. The legacy
  // Text/Image/Shape panels address `slide.elements`, which block slides do
  // not use, so they would render inert controls here.
  const activeSlideForPanel: any = slides?.[selectedSlideIndex];
  const activeBlockSpec = activeSlideForPanel?.blockSpec;
  const hasBlockSlides = (slides || []).some((sl: any) => !!sl?.blockSpec);
  const selectedBlockRef = parseBlockElementId(selectedTextId);

  const updateActiveBlockSpec = (nextSpec: any) => {
    const updated = structuredClone(slides);
    if (!updated[selectedSlideIndex]) return;
    updated[selectedSlideIndex].blockSpec = nextSpec;
    const headingBlock: any = nextSpec.blocks.find((b: any) => b.type === "heading");
    if (headingBlock?.title?.text) {
      const existing: any = updated[selectedSlideIndex].slide_title ?? {};
      updated[selectedSlideIndex].slide_title = {
        ...existing,
        konva_component: existing.konva_component ?? "Konva.Text",
        text: headingBlock.title.text,
      };
    }
    setSlides(updated);
  };
  const isImageSelected = selectedImageIndex !== null || !!selectedImage || !!selectedImageId;
  const isShapeSelected = selectedShapeIndex !== null || !!selectedShapeId;

  const hasElementSelected = isTextSelected || isImageSelected || isShapeSelected;


  const handleOpenThemePanel = () => {
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setSelectedShapeIndex(null);
    setIsMobileImageSelected(false);
    setIsThemePanelOpen(true);
  };

  const handleCloseThemePanel = () => {
    setIsThemePanelOpen(false);
  };

  // Auto-fit the slide canvas to the available workspace. PAD_X is fixed
  // regardless of whether a rail panel is open — the panels overlay the
  // canvas (see panelTheme.ts) rather than resizing it, so this permanent
  // reservation (rail 56px + panel 300px + margin) keeps the slide clear of
  // them without the canvas ever having to resize/shift when one opens.
  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el || isMobile) return;

    const THUMBNAIL_STRIP_HEIGHT = 120; // bottom slide-thumbnail carousel (152px-wide thumbnails)
    const PAD_X = 640;
    const PAD_Y = 96;

    const compute = () => {
      const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
      const availW = el.clientWidth - PAD_X;
      const availH = el.clientHeight - THUMBNAIL_STRIP_HEIGHT - PAD_Y;
      const next = Math.min(availW / SLIDE_WIDTH, availH / SLIDE_HEIGHT, 0.8);
      setFitScale(Math.max(next, 0.35));
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  const handleZoomIn = () => {
    setZoomOverride(Math.min((zoomOverride ?? fitScale) + 0.1, 1.5));
  };
  const handleZoomOut = () => {
    setZoomOverride(Math.max((zoomOverride ?? fitScale) - 0.1, 0.35));
  };
  const handleZoomFit = () => {
    setZoomOverride(null);
  };

  const handleDeselect = () => {
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setIsMobileImageSelected(false);

    if (isMobile) {
      setIsThemePanelOpen(true);
    } else {
      setShowRightPanel(true);
    }
  };
  const deselectAllRef = useRef<(() => void) | null>(null);
  const handlePreviewOpen = () => {
    // Call the SlideEditor's deselectAll function
    if (deselectAllRef.current) {
      deselectAllRef.current();
    }

    // Also clear all parent component states
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setSelectedShapeIndex(null);
    setIsMobileImageSelected(false);

    // Open preview after state updates
    setTimeout(() => {
      setPreviewOpen(true);
    }, 100);
  };
  useEffect(() => {
    const hasSelection = !!selectedTextId || selectedImageIndex !== null || selectedShapeIndex !== null;
    if (hasSelection) {
      setHadSelection(true);
    } else if (hadSelection && isMobile) {
      setIsThemePanelOpen(true);
      setHadSelection(false);
    }
  }, [selectedTextId, selectedImageIndex, selectedShapeIndex, hadSelection, isMobile]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: SHELL.bg,
          maxWidth: "100%",
          overflow: "hidden",
          transition: "background 0.3s ease-in-out",
        }}
      >
        {!isMobile ? (
          <div
            style={{
              flexShrink: 0,
              height: "56px",
              zIndex: 20,
            }}
          >
            <UpperNavBar
              onExportPDF={handleExportPDF}
              onExportPPT={handleExportPPTX}
              onClearCanvas={handleClearCanvas}
              onPreview={handlePreviewOpen}
              onOpenThemePanel={handleOpenThemePanel}

              saveState={autosave.state}

              onSaveNow={autosave.saveNow}


              exportOptions={exportOptions}


              onExportOptionsChange={setExportOptions}


              slideCount={slides.length}


              currentSlideNumber={selectedSlideIndex + 1}

              title={deckTitle}

              onTitleChange={setDeckTitle}
              isThemePanelOpen={isThemePanelOpen}
              showAuthModal={showAuthModal}
              setShowAuthModal={setShowAuthModal}
              isExportingPDF={isExportingPDF}
              isExportingPPT={isExportingPPTX}
              zoomPercent={Math.round(scale * 100)}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomFit={handleZoomFit}
              isZoomFit={zoomOverride === null}
            />
          </div>
        ) : (
          <UpperNavBar
            onExportPDF={handleExportPDF}
            onExportPPT={handleExportPPTX}
            onClearCanvas={handleClearCanvas}
            onPreview={handlePreviewOpen}
            onOpenThemePanel={handleOpenThemePanel}

            saveState={autosave.state}

            onSaveNow={autosave.saveNow}


            exportOptions={exportOptions}


            onExportOptionsChange={setExportOptions}


            slideCount={slides.length}


            currentSlideNumber={selectedSlideIndex + 1}

            title={deckTitle}

            onTitleChange={setDeckTitle}
            isThemePanelOpen={isThemePanelOpen}
            showAuthModal={showAuthModal}
            setShowAuthModal={setShowAuthModal}
            isExportingPDF={isExportingPDF}
            isExportingPPT={isExportingPPTX}
          />
        )}
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          {isMobile ? (
            <>
              <LowerNavbarMobile
                showTemplatePanel={showTemplatePanel}
                setShowTemplatePanel={setShowTemplatePanel}
              />
              {slides.length === 0 ? (
                <EditorEmptyState />
              ) : (
                <>
                  <SlideEditorMobile slides={slides} onDeselect={handleDeselect} />
                  <SlideShowPlayer
                    slides={slides}
                    open={previewOpen}
                    onClose={() => setPreviewOpen(false)}
                    theme={selectedTheme}
                    forceCleanPreview={previewOpen}
                    key={previewOpen ? "clean" : "normal"}
                  />
                </>
              )}
              {isTextSelected && !isShapeSelected && (
                <TextSettingsPanelMobile
                  resetAll={resetAll}
                  onClose={() => setSelectedTextId(null)}
                  style={{ top: 100, left: 100 }}
                />
              )}
              {isMobileImageSelected && (
                <ImageSettingsPanelMobile
                  resetAll={resetAll}
                  onClose={() => {
                    setIsMobileImageSelected(false);
                    setSelectedImageIndex(null);
                    setSelectedImage(null);
                  }}
                  style={{ top: 100, left: 100 }}
                />
              )}
              {isShapeSelected && (
                <ShapeSettingsPanelMobile
                  resetAll={resetAll}
                  onClose={() => {
                    setSelectedTextId(null);
                    setSelectedImageIndex(null);
                    setSelectedImage(null);
                    setSelectedImageId(null);
                    setSelectedShapeIndex(null);
                    setSelectedShapeId(null);
                    setIsMobileImageSelected(false);
                  }}
                  style={{ top: 100, left: 100 }}
                />
              )}
              {isThemePanelOpen && !isShapeSelected && (
                // Mobile has no left rail, so the menu is the only route to
                // themes. The legacy palette writes fields a block slide does
                // not read, so a template deck gets the block theme picker
                // instead -- otherwise tapping Themes on mobile does nothing.
                hasBlockSlides ? (
                  <Box sx={{ position: "fixed", inset: 0, zIndex: 1300, bgcolor: "background.paper" }}>
                    <BlockThemePanel onClose={handleCloseThemePanel} />
                  </Box>
                ) : (
                  <ThemePanelMobile
                    parsedSlides={slides}
                    resetAll={resetAll}
                    onClose={handleCloseThemePanel}
                  />
                )
              )}
            </>
          ) : (
            <div className="relative flex flex-1 min-h-0 overflow-hidden">
              <div className="shrink-0 z-10">
                <SideNavBar
                  showTemplatePanel={showTemplatePanel}
                  setShowTemplatePanel={setShowTemplatePanel}
                />
              </div>
              <div
                ref={canvasContainerRef}
                className="flex-1 overflow-auto z-0"
                style={{
                  marginTop: 0,
                  background: "#FAFAFA",
                  backgroundImage: [
                    "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)",
                    "linear-gradient(45deg, #F0F0F1 25%, transparent 25%)",
                    "linear-gradient(-45deg, #F0F0F1 25%, transparent 25%)",
                    "linear-gradient(45deg, transparent 75%, #F0F0F1 75%)",
                    "linear-gradient(-45deg, transparent 75%, #F0F0F1 75%)",
                  ].join(", "),
                  backgroundSize: "28px 28px, 48px 48px, 48px 48px, 48px 48px, 48px 48px",
                  backgroundPosition: "0 0, 0 0, 0 24px, 24px -24px, -24px 0px",
                }}
              >
                {slides.length === 0 ? (
                  <EditorEmptyState />
                ) : (
                  <>
                    <SlideEditor slides={slides} onDeselect={handleDeselect} slideCount={slides.length} deselectAllRef={deselectAllRef} scale={scale} />
                    <SlideShowPlayer
                      slides={slides}
                      theme={selectedTheme}
                      open={previewOpen}
                      onClose={() => setPreviewOpen(false)}
                      forceCleanPreview={previewOpen}
                      key={previewOpen ? "clean" : "normal"}
                    />
                  </>
                )}
              </div>
              <div
                className={`
                  ${isLGScreen ? "relative" : "fixed top-0 right-0 h-full z-40"}
                  transition-all duration-300 ease-in-out flex scrollbar-hide
                  ${!isLGScreen && showRightPanel
                    ? "w-96"
                    : isLGScreen
                      ? "w-[310px]"
                      : "w-0"
                  }
                `}
                style={{
                  background: SHELL.bg,
                  borderLeft: `1px solid ${SHELL.border}`,
                  boxShadow: "-4px 0 24px rgba(74, 0, 224, 0.04)",
                }}
              >
                {!isLGScreen && (
                  <div
                    className={`
                      absolute -left-5 top-24
                      border-r-0 border border-purple-100 shadow-xl
                      rounded-l-xl px-2 py-2 cursor-pointer z-50
                      transition-transform duration-150 ease-out hover:scale-110 active:scale-95
                    `}
                    style={{ background: SHELL.bg }}
                    onClick={() => setShowRightPanel(!showRightPanel)}
                  >
                    {showRightPanel ? (
                      <CloseIcon sx={{ color: SHELL.accent }} fontSize="small" />
                    ) : (
                      <SettingsIcon sx={{ color: SHELL.accent }} fontSize="small" />
                    )}
                  </div>
                )}
                <div
                  className={`transition-opacity duration-300 ease-in-out overflow-auto w-full scrollbar-hide ${!showRightPanel && !isLGScreen
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100"
                    }`}
                >
                  {activeBlockSpec ? (
                    selectedBlockRef ? (
                      <BlockInspector
                        spec={activeBlockSpec}
                        blockId={selectedBlockRef.blockId}
                        onChange={updateActiveBlockSpec}
                      />
                    ) : (
                      <ThemePanel parsedSlides={slides} resetAll={resetAll} />
                    )
                  ) : (
                    <>
                      {isTextSelected && !isShapeSelected && (
                        <TextSettingsPanel resetAll={resetAll} />
                      )}
                      {isImageSelected && <ImageSettingsPanel />}
                      {isShapeSelected && (
                        <ShapeSettingsPanel resetAll={resetAll} />
                      )}
                      {!isTextSelected && !isImageSelected && !isShapeSelected && (
                        <ThemePanel parsedSlides={slides} resetAll={resetAll} />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showAuthModal && (
        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          presentationId={presentationId}
        />
      )}
    </>
  );
};

export default Page;