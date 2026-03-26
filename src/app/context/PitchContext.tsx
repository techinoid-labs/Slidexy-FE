"use client";

import { createContext, useContext, useState } from "react";
import { SlideData } from "@/app/pitch/types";

type PitchResponse = {
    id?: string;
    _id?: string;
    success: boolean;
    topic: string;
    theme: string;
    slideCount: number;
    slides: SlideData[];
    metadata: {
        generatedAt: string;
        designGuidelines: string;
        customSystemPrompt: string;
    };
};

type PitchContextType = {
    pitch: PitchResponse | null;
    setPitch: (data: PitchResponse) => void;
    clearPitch: () => void;
};

const PitchContext = createContext<PitchContextType | null>(null);

export const PitchProvider = ({ children }: { children: React.ReactNode }) => {
    const [pitch, setPitchState] = useState<PitchResponse | null>(null);

    const setPitch = (data: PitchResponse) => {
        setPitchState(data);
    };

    const clearPitch = () => {
        setPitchState(null);
    };

    return (
        <PitchContext.Provider value={{ pitch, setPitch, clearPitch }}>
            {children}
        </PitchContext.Provider>
    );
};

export const usePitch = () => {
    const ctx = useContext(PitchContext);
    if (!ctx) {
        throw new Error("usePitch must be used inside PitchProvider");
    }
    return ctx;
};
