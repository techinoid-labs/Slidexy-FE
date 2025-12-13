"use client";
import { useState, useCallback } from 'react';

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
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [clickedElementId, setClickedElementId] = useState<string | null>(null);

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

            // Optional Image
            if (imageFile) {
                formData.append('image', imageFile);
            }

            // Call PUT endpoint (The new fix!)
            const response = await fetch(`${API_BASE_URL}/api/dynamic-website/${presentationId}`, {
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
        }
    }, [presentationId, history, clickedElementId, onSuccess]);

    // Handle messages from iframe (Click-to-Edit)
    const handleIframeMessage = useCallback((event: MessageEvent) => {
        if (event.data && event.data.type === 'NEURO_ELEMENT_CLICKED') {
            const { id, tagName } = event.data;
            if (id) {
                console.log("Selected Element:", id);
                setClickedElementId(id);
            }
        }
    }, []);

    return {
        loading,
        history,
        clickedElementId,
        setClickedElementId,
        editWebsite,
        handleIframeMessage
    };
}
