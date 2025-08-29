import type { Slide, SlideElement } from "../types/presentation"

export const createBoldTemplate = (backendSlide: any, slideIndex: number): Slide => {
	const elements: SlideElement[] = []
	const { slide_id, slide_title, image_url, textBlock, imageBlock } = backendSlide

	// Bold, high-contrast palette
	const palettes = [
		{ primary: "#111111", accent: "#f43f5e", bg: "#f1f5f9", text: "#0f172a", extra: "#f59e42" },
		{ primary: "#f43f5e", accent: "#111111", bg: "#fff7ed", text: "#f43f5e", extra: "#6366f1" },
		{ primary: "#0ea5e9", accent: "#f59e42", bg: "#f0fdfa", text: "#0f172a", extra: "#f43f5e" },
		{ primary: "#f59e42", accent: "#0ea5e9", bg: "#fef9c3", text: "#78350f", extra: "#0ea5e9" },
	]
	const palette = palettes[slideIndex % palettes.length]

		// Bold, layered gradient background
		elements.push({
			element_type: "shape",
			konva_component: "Konva.Rect",
			properties: {
				x: 0,
				y: 0,
				width: 960,
				height: 540,
				fill: palette.bg,
				fillLinearGradientStartPoint: { x: 0, y: 0 },
				fillLinearGradientEndPoint: { x: 960, y: 540 },
				fillLinearGradientColorStops: [0, palette.bg, 0.4, palette.extra, 1, palette.accent],
				zIndex: 0,
			},
			id: `bg-gradient-${slide_id || slideIndex}`,
		})

		// Large blurred accent blob (top left)
		elements.push({
			element_type: "shape",
			konva_component: "Konva.Circle",
			properties: {
				x: 120,
				y: 80,
				radius: 120,
				fill: palette.accent,
				opacity: 0.13,
				shadowBlur: 80,
				zIndex: 1,
			},
			id: `bg-blob1-${slide_id || slideIndex}`,
		})

		// Large blurred accent blob (bottom right)
		elements.push({
			element_type: "shape",
			konva_component: "Konva.Circle",
			properties: {
				x: 900,
				y: 500,
				radius: 140,
				fill: palette.primary,
				opacity: 0.10,
				shadowBlur: 100,
				zIndex: 1,
			},
			id: `bg-blob2-${slide_id || slideIndex}`,
		})

		// Diagonal accent bar (top right)
		elements.push({
			element_type: "shape",
			konva_component: "Konva.Rect",
			properties: {
				x: 700,
				y: -30,
				width: 320,
				height: 40,
				fill: palette.extra,
				opacity: 0.12,
				rotation: 24,
				zIndex: 2,
			},
			id: `bg-bar-${slide_id || slideIndex}`,
		})

	const layoutType = slideIndex % 4

		// Layout 0: Bold hero (centered, image left, text right)
		if (layoutType === 0) {
			// Image left, text right
			const imageSrc = imageBlock?.elements?.[0]?.properties?.imageSrc || image_url
				if (imageSrc) {
					// Add blurred rectangle as shadow behind image
					elements.push({
						element_type: "shape",
						konva_component: "Konva.Rect",
						properties: {
							x: 80,
							y: 120,
							width: 340,
							height: 340,
							fill: palette.accent,
							opacity: 0.13,
							shadowBlur: 32,
							cornerRadius: 48,
							zIndex: 2,
						},
						id: `hero-image-shadow-${slide_id}-${slideIndex}`,
					})
					elements.push({
						element_type: "image",
						konva_component: "Konva.Image",
						properties: {
							imageSrc,
							x: 80,
							y: 120,
							width: 340,
							height: 340,
							zIndex: 3,
							rounded: 48,
						},
						id: `hero-image-${slide_id}-${slideIndex}`,
					})
				}
			if (slide_title?.text) {
				elements.push({
					element_type: "title",
					konva_component: "Konva.Text",
					text: slide_title.text.toUpperCase(),
					properties: {
						x: 460,
						y: 180,
						fontSize: 64,
						fontFamily: "Oswald, Inter, sans-serif",
						fill: palette.primary,
						fontWeight: "900",
						width: 420,
						align: "left",
						zIndex: 4,
					},
					id: slide_title.id || `title-${slide_id}-${slideIndex}`,
				})
			}
			// Subtitle below title
			if (textBlock?.elements?.[0]) {
				elements.push({
					element_type: "text",
					konva_component: "Konva.Text",
					text: textBlock.elements[0].text,
					properties: {
						x: 460,
						y: 270,
						fontSize: 28,
						fontFamily: "Inter, sans-serif",
						fill: palette.text,
						fontWeight: "600",
						width: 420,
						align: "left",
						zIndex: 4,
					},
					id: `subtitle-${slide_id}-${slideIndex}`,
				})
			}
		}

		// Layout 1: Bold split (image right, text left, vertical accent)
		else if (layoutType === 1) {
			// Vertical accent bar
			elements.push({
				element_type: "shape",
				konva_component: "Konva.Rect",
				properties: {
					x: 80,
					y: 60,
					width: 8,
					height: 420,
					fill: palette.accent,
					opacity: 0.7,
					zIndex: 2,
				},
				id: `accent-vert-${slide_id || slideIndex}`,
			})
			if (slide_title?.text) {
				elements.push({
					element_type: "title",
					konva_component: "Konva.Text",
					text: slide_title.text,
					properties: {
						x: 120,
						y: 80,
						fontSize: 48,
						fontFamily: "Oswald, Inter, sans-serif",
						fill: palette.primary,
						fontWeight: "800",
						width: 400,
						zIndex: 3,
					},
					id: slide_title.id || `title-${slide_id}-${slideIndex}`,
				})
			}
			// Bullet points, staggered
			textBlock?.elements?.forEach((point: any, i: number) => {
				elements.push({
					element_type: "bullet_point",
					konva_component: "Konva.Text",
					text: point.text,
					properties: {
						x: 120 + (i % 2 === 0 ? 0 : 30),
						y: 160 + i * 60,
						fontSize: 22,
						fontFamily: "Inter, sans-serif",
						fill: palette.text,
						fontWeight: "700",
						width: 340,
						zIndex: 3,
					},
					id: point.id || `bullet-${slide_id}-${i}`,
				})
				// Bold bullet indicator
				elements.push({
					element_type: "shape",
					konva_component: "Konva.Circle",
					properties: {
						x: 100 + (i % 2 === 0 ? 0 : 30),
						y: 170 + i * 60,
						radius: 10,
						fill: palette.accent,
						zIndex: 3,
					},
					id: `bullet-dot-${slide_id}-${i}`,
				})
			})
			// Image right, overlapping accent blob
			const imageSrc = imageBlock?.elements?.[0]?.properties?.imageSrc || image_url
				if (imageSrc) {
					// Add blurred rectangle as shadow behind image
					elements.push({
						element_type: "shape",
						konva_component: "Konva.Rect",
						properties: {
							x: 540,
							y: 80,
							width: 340,
							height: 380,
							fill: palette.primary,
							opacity: 0.10,
							shadowBlur: 24,
							cornerRadius: 48,
							zIndex: 3,
						},
						id: `image-shadow-${slide_id}-${slideIndex}`,
					})
					elements.push({
						element_type: "image",
						konva_component: "Konva.Image",
						properties: {
							imageSrc,
							x: 540,
							y: 80,
							width: 340,
							height: 380,
							zIndex: 4,
							rounded: 48,
						},
						id: `image-${slide_id}-${slideIndex}`,
					})
					// Overlapping accent blob
					elements.push({
						element_type: "shape",
						konva_component: "Konva.Circle",
						properties: {
							x: 740,
							y: 420,
							radius: 60,
							fill: palette.extra,
							opacity: 0.18,
							shadowBlur: 40,
							zIndex: 3,
						},
						id: `blob-overlap-${slide_id}-${slideIndex}`,
					})
				}
		}

		// Layout 2: Bold image focus (image bottom, text top, accent triangle)
		else if (layoutType === 2) {
			// Accent triangle (top left)
			elements.push({
				element_type: "shape",
				konva_component: "Konva.Line",
				properties: {
					points: [0, 0, 120, 0, 0, 120],
					fill: palette.extra,
					opacity: 0.13,
					closed: true,
					zIndex: 2,
				},
				id: `accent-triangle-${slide_id}-${slideIndex}`,
			})
			if (slide_title?.text) {
				elements.push({
					element_type: "title",
					konva_component: "Konva.Text",
					text: slide_title.text,
					properties: {
						x: 80,
						y: 60,
						fontSize: 44,
						fontFamily: "Oswald, Inter, sans-serif",
						fill: palette.primary,
						fontWeight: "900",
						width: 800,
						align: "center",
						zIndex: 3,
					},
					id: slide_title.id || `title-${slide_id}-${slideIndex}`,
				})
			}
			// Content bullets below title
			textBlock?.elements?.forEach((point: any, i: number) => {
				elements.push({
					element_type: "bullet_point",
					konva_component: "Konva.Text",
					text: point.text,
					properties: {
						x: 120,
						y: 120 + i * 40,
						fontSize: 20,
						fontFamily: "Inter, sans-serif",
						fill: palette.text,
						fontWeight: "700",
						width: 720,
						zIndex: 3,
					},
					id: point.id || `bullet-${slide_id}-${i}`,
				})
			})
			// Image bottom, wide
			const imageSrc = imageBlock?.elements?.[0]?.properties?.imageSrc || image_url
				if (imageSrc) {
					// Add blurred rectangle as shadow behind image
					elements.push({
						element_type: "shape",
						konva_component: "Konva.Rect",
						properties: {
							x: 80,
							y: 320,
							width: 800,
							height: 180,
							fill: palette.accent,
							opacity: 0.13,
							shadowBlur: 24,
							cornerRadius: 32,
							zIndex: 3,
						},
						id: `image-shadow-${slide_id}-${slideIndex}`,
					})
					elements.push({
						element_type: "image",
						konva_component: "Konva.Image",
						properties: {
							imageSrc,
							x: 80,
							y: 320,
							width: 800,
							height: 180,
							zIndex: 4,
							rounded: 32,
						},
						id: `image-${slide_id}-${slideIndex}`,
					})
				}
		}

		// Layout 3: Bold statement/quote (centered, accent underline, image as watermark)
		else {
			// Large bold quote mark
			elements.push({
				element_type: "text",
				konva_component: "Konva.Text",
				text: '"',
				properties: {
					x: 120,
					y: 120,
					fontSize: 140,
					fontFamily: "Oswald, Georgia, serif",
					fill: palette.accent,
					width: 120,
					zIndex: 2,
				},
				id: `quote-mark-${slide_id}-${slideIndex}`,
			})
			if (slide_title?.text) {
				elements.push({
					element_type: "title",
					konva_component: "Konva.Text",
					text: slide_title.text,
					properties: {
						x: 260,
						y: 200,
						fontSize: 54,
						fontFamily: "Oswald, Inter, sans-serif",
						fill: palette.primary,
						fontWeight: "900",
						width: 600,
						align: "center",
						zIndex: 3,
					},
					id: slide_title.id || `title-${slide_id}-${slideIndex}`,
				})
			}
			// Bold accent underline
			elements.push({
				element_type: "shape",
				konva_component: "Konva.Rect",
				properties: {
					x: 320,
					y: 270,
					width: 320,
					height: 8,
					fill: palette.accent,
					zIndex: 3,
				},
				id: `attribution-line-${slide_id}-${slideIndex}`,
			})
			// Watermark image (very light, behind text)
			const imageSrc = imageBlock?.elements?.[0]?.properties?.imageSrc || image_url
			if (imageSrc) {
				elements.push({
					element_type: "image",
					konva_component: "Konva.Image",
					properties: {
						imageSrc,
						x: 400,
						y: 320,
						width: 200,
						height: 120,
						opacity: 0.08,
						zIndex: 1,
						rounded: 32,
					},
					id: `watermark-image-${slide_id}-${slideIndex}`,
				})
			}
		}

	return {
		slide_id: slide_id || `slide-${slideIndex}`,
		title: slide_title?.text || `Slide ${slideIndex + 1}`,
		image_url: image_url || undefined,
		elements,
	}
}
