"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface VideoJob {
    jobId: string | null;
    progress: number;
    videoUrl: string | null;
    setJobId: (id: string | null) => void;
    setProgress: (p: number) => void;
    setVideoUrl: (url: string | null) => void;
    resetJob: () => void;
}

const VideoJobContext = createContext<VideoJob | undefined>(undefined);

export const VideoJobProvider = ({ children }: { children: ReactNode }) => {
    const [jobId, setJobId] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // Rehydrate from localStorage on mount
    useEffect(() => {
        const savedUrl = localStorage.getItem("savedVideoUrl");
        const savedProgress = localStorage.getItem("savedVideoProgress");
        if (savedUrl) setVideoUrl(savedUrl);
        if (savedProgress) setProgress(Number(savedProgress));
    }, []);

    // Persist changes to localStorage
    useEffect(() => {
        if (videoUrl) localStorage.setItem("savedVideoUrl", videoUrl);
        else localStorage.removeItem("savedVideoUrl");
    }, [videoUrl]);

    useEffect(() => {
        localStorage.setItem("savedVideoProgress", progress.toString());
    }, [progress]);

    const resetJob = () => {
        setJobId(null);
        setProgress(0);
        setVideoUrl(null);
        localStorage.removeItem("savedVideoUrl");
        localStorage.removeItem("savedVideoProgress");
    };

    return (
        <VideoJobContext.Provider
            value={{ jobId, progress, videoUrl, setJobId, setProgress, setVideoUrl, resetJob }}
        >
            {children}
        </VideoJobContext.Provider>
    );
};

export const useVideoJob = () => {
    const context = useContext(VideoJobContext);
    if (!context) {
        throw new Error("useVideoJob must be used within a VideoJobProvider");
    }
    return context;
};
