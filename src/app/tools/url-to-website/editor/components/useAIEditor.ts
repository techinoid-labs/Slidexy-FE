"use client";
import { useState, useCallback, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UseAIEditorProps {
    presentationId: string;
    onSuccess: (newFiles: any[]) => void;
}

interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export function useAIEditor({ presentationId, onSuccess }: UseAIEditorProps) {
    const [loading, setLoading] = useState(false);
    const [clickedElementId, setClickedElementId] = useState<string | null>(null);
    const [clickedElementStyles, setClickedElementStyles] = useState<any>(null);

    // Initialize history from localStorage or empty array
    const [history, setHistory] = useState<ChatMessage[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const stored = localStorage.getItem(`ai-editor-history-${presentationId}`);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Persist history to localStorage whenever it changes
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(`ai-editor-history-${presentationId}`, JSON.stringify(history));
        } catch (error) {
            console.warn('Failed to save history:', error);
        }
    }, [history, presentationId]);

    // Call this API to edit the website
    const editWebsite = useCallback(async (prompt: string, imageFile?: File) => {
        if (!presentationId) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('prompt', prompt);

            // Pass history for context
            if (history.length > 0) {
                formData.append('history', JSON.stringify(history));
            }

            // Pass clicked element ID for surgical edits
            if (clickedElementId) {
                formData.append('clickedElementId', clickedElementId);
            }

            // Pass computed styles for context-aware editing
            if (clickedElementStyles) {
                formData.append('computedStyles', JSON.stringify(clickedElementStyles));
            }

            // Optional Image
            if (imageFile) {
                formData.append('image', imageFile);
            }

            // Call backend editor API (PUT for editing existing website)
            const response = await fetch(`${API_BASE_URL}/api/website-editor/${presentationId}`, {
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to edit website");
            }

            // Update local history
            const newHistory: ChatMessage[] = [
                ...history,
                { role: 'user', content: prompt },
                { role: 'model', content: result.message || "Updated website." }
            ];
            setHistory(newHistory);

            // Notify parent to refresh files
            if (onSuccess && result.data && result.data.files) {
                onSuccess(result.data.files);
            } else if (onSuccess) {
                // Fallback if full file list isn't returned, trigger fetch
                onSuccess([]);
            }

            return result;

        } catch (error) {
            console.error("AI Edit Failed:", error);
            throw error;
        } finally {
            setLoading(false);
            setClickedElementId(null); // Reset selection after edit
            setClickedElementStyles(null); // Reset styles after edit
        }
    }, [presentationId, history, clickedElementId, onSuccess]);

    // Handle messages from iframe (Click-to-Edit)
    const handleIframeMessage = useCallback((event: MessageEvent) => {
        if (event.data && event.data.type === 'NEURO_ELEMENT_CLICKED') {
            const { id, tagName, computedStyles } = event.data;
            if (id) {
                console.log("Selected Element:", id);
                console.log("Element Styles:", computedStyles);
                setClickedElementId(id);
                setClickedElementStyles(computedStyles || null);
            }
        }
    }, []);

    return {
        loading,
        history,
        clickedElementId,
        clickedElementStyles,
        setClickedElementId,
        editWebsite,
        handleIframeMessage
    };
}
