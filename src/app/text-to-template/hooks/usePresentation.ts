"use client"

import { useState, useEffect } from "react"
import type { BackendPresentation } from "../types/presentation"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("[SlidesX] API_BASE_URL_FETCH:", API_BASE_URL);
export const usePresentation = (presentationId: string) => {
  const [presentation, setPresentation] = useState<BackendPresentation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/presentation/${presentationId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch presentation")
        }
        else{
          console.log("Fetched data succesully" + response);
        }

        const data = await response.json()
        setPresentation(data)
      } catch (err) {
        console.error("Error fetching presentation:", err)
        setError(err instanceof Error ? err.message : "Unknown error")

        // Fallback to mock data
        setPresentation({
          id: presentationId,
          title: "Sample Business Presentation",
          topic: "Business",
          meta: {
            audience: "Business Executives",
            tone: "Sales Pitch",
          },
          slides: [
            {
              slide_id: "1",
              title: "Welcome to Our Company",
              content: "We are a leading technology company focused on innovation and excellence in digital solutions.",
              bullet_points: [
                "Industry-leading expertise",
                "Cutting-edge technology solutions",
                "Customer-focused approach",
                "Global reach and local support",
              ],
              image_url: "/modern-office-building.png",
            },
            {
              slide_id: "2",
              title: "Our Services",
              content:
                "We provide comprehensive digital transformation services to help businesses thrive in the modern economy.",
              bullet_points: [
                "Cloud Infrastructure Solutions",
                "AI & Machine Learning Integration",
                "Custom Software Development",
                "Digital Strategy Consulting",
                "24/7 Technical Support",
              ],
              image_url: "/team-collaboration-technology.png",
            },
            {
              slide_id: "3",
              title: "Why Choose Us",
              content:
                "Our proven track record and commitment to excellence make us the ideal partner for your digital journey.",
              bullet_points: [
                "10+ years of industry experience",
                "500+ successful projects delivered",
                "99.9% uptime guarantee",
                "Award-winning customer service",
                "Competitive pricing models",
              ],
              image_url: "/business-success-growth-chart.png",
            },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    if (presentationId) {
      fetchPresentation()
    }
  }, [presentationId])

  return { presentation, loading, error }
}
