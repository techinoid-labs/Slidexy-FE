"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

/**
 * LinkedIn Context for managing LinkedIn OAuth connection and sharing state
 * Provides hooks for LinkedIn authentication, connection status, and sharing
 */

type LinkedInProfile = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

type LinkedInConnectionStatus = {
  connected: boolean;
  tokenValid: boolean;
  profile: LinkedInProfile | null;
  expiryDate: string | null;
};

type LinkedInContextType = {
  // Connection status
  isConnected: boolean;
  connectionLoading: boolean;
  connectionError: string | null;
  connectionStatus: LinkedInConnectionStatus | null;

  // Auth flow
  initiateAuth: () => Promise<string | null>;
  handleCallback: (code: string, state: string) => Promise<boolean>;
  disconnect: () => Promise<boolean>;

  // Sharing
  shareSlide: (params: {
    presentationId: string;
    slideIndex: number;
    message?: string;
  }) => Promise<{ success: boolean; message: string }>;
  shareCustomContent: (params: {
    imageUrl: string;
    message?: string;
  }) => Promise<{ success: boolean; message: string }>;
  /** Post the whole deck as a swipeable document carousel. */
  shareDeckAsCarousel: (params: {
    pdf: Blob;
    message: string;
    title?: string;
  }) => Promise<{ success: boolean; message: string }>;

  // Refresh
  refreshConnectionStatus: () => Promise<void>;
};

const LinkedInContext = createContext<LinkedInContextType | undefined>(undefined);

export const LinkedInProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<LinkedInConnectionStatus | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Get authorization URL to start OAuth flow
  const initiateAuth = useCallback(async (): Promise<string | null> => {
    if (!session?.user?.accessToken) {
      setConnectionError("User not authenticated");
      return null;
    }

    try {
      setConnectionLoading(true);
      setConnectionError(null);

      const response = await axios.get(
        `${API_BASE_URL}/api/linkedin/auth`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (response.data?.authUrl) {
        return response.data.authUrl;
      } else {
        setConnectionError("Failed to get authorization URL");
        return null;
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || error.message || "Failed to initiate LinkedIn auth";
      setConnectionError(errorMsg);
      console.error("[LinkedIn] Auth initiation error:", errorMsg);
      return null;
    } finally {
      setConnectionLoading(false);
    }
  }, [session?.user?.accessToken, API_BASE_URL]);

  // Handle OAuth callback (after user authorizes on LinkedIn)
  const handleCallback = useCallback(
    async (code: string, state: string): Promise<boolean> => {
      try {
        setConnectionLoading(true);
        setConnectionError(null);

        const response = await axios.get(
          `${API_BASE_URL}/api/linkedin/callback`,
          {
            params: { code, state },
          }
        );

        // Refresh connection status after callback
        await refreshConnectionStatus();
        return true;
      } catch (error: any) {
        const errorMsg =
          error.response?.data?.error || error.message || "Failed to handle LinkedIn callback";
        setConnectionError(errorMsg);
        console.error("[LinkedIn] Callback error:", errorMsg);
        return false;
      } finally {
        setConnectionLoading(false);
      }
    },
    [API_BASE_URL]
  );

  // Check current LinkedIn connection status
  const refreshConnectionStatus = useCallback(async () => {
    if (!session?.user?.accessToken) {
      setIsConnected(false);
      setConnectionStatus(null);
      return;
    }

    try {
      setConnectionLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/linkedin/status`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      const status = response.data;
      setConnectionStatus(status);
      setIsConnected(status.connected === true);
      setConnectionError(null);
    } catch (error: any) {
      // 404 is expected if the user has no connection record or the endpoint is missing
      if (error.response?.status === 404) {
        // console.log("[LinkedIn] Status check: Not found (404), assuming disconnected.");
      } else {
        console.error("[LinkedIn] Status check error:", error);
      }
      setIsConnected(false);
      setConnectionStatus(null);
      // Don't set error here as status check is optional
    } finally {
      setConnectionLoading(false);
    }
  }, [session?.user?.accessToken, API_BASE_URL]);

  // Disconnect LinkedIn account
  const disconnect = useCallback(async (): Promise<boolean> => {
    if (!session?.user?.accessToken) {
      setConnectionError("User not authenticated");
      return false;
    }

    try {
      setConnectionLoading(true);
      setConnectionError(null);

      await axios.delete(`${API_BASE_URL}/api/linkedin/disconnect`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      setIsConnected(false);
      setConnectionStatus(null);
      return true;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || error.message || "Failed to disconnect LinkedIn";
      setConnectionError(errorMsg);
      console.error("[LinkedIn] Disconnect error:", errorMsg);
      return false;
    } finally {
      setConnectionLoading(false);
    }
  }, [session?.user?.accessToken, API_BASE_URL]);

  // Share a presentation slide to LinkedIn
  const shareSlide = useCallback(
    async (params: {
      presentationId: string;
      slideIndex: number;
      message?: string;
    }): Promise<{ success: boolean; message: string }> => {
      if (!session?.user?.accessToken) {
        return {
          success: false,
          message: "User not authenticated",
        };
      }

      if (!isConnected) {
        return {
          success: false,
          message: "LinkedIn not connected. Please connect first.",
        };
      }

      try {
        setConnectionLoading(true);
        setConnectionError(null);

        const response = await axios.post(
          `${API_BASE_URL}/api/linkedin/share`,
          {
            presentationId: params.presentationId,
            slideIndex: params.slideIndex,
            message: params.message || "Check out this slide!",
          },
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        return {
          success: true,
          message: response.data?.message || "Slide shared successfully!",
        };
      } catch (error: any) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to share slide";
        setConnectionError(errorMsg);
        console.error("[LinkedIn] Share slide error:", errorMsg);
        return {
          success: false,
          message: errorMsg,
        };
      } finally {
        setConnectionLoading(false);
      }
    },
    [session?.user?.accessToken, isConnected, API_BASE_URL]
  );

  // Share custom content (external image URL) to LinkedIn
  const shareCustomContent = useCallback(
    async (params: {
      imageUrl: string;
      message?: string;
    }): Promise<{ success: boolean; message: string }> => {
      if (!session?.user?.accessToken) {
        return {
          success: false,
          message: "User not authenticated",
        };
      }

      if (!isConnected) {
        return {
          success: false,
          message: "LinkedIn not connected. Please connect first.",
        };
      }

      try {
        setConnectionLoading(true);
        setConnectionError(null);

        const response = await axios.post(
          `${API_BASE_URL}/api/linkedin/share-custom`,
          {
            imageUrl: params.imageUrl,
            message: params.message || "Check this out!",
          },
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        return {
          success: true,
          message: response.data?.message || "Content shared successfully!",
        };
      } catch (error: any) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to share content";
        setConnectionError(errorMsg);
        console.error("[LinkedIn] Share custom error:", errorMsg);
        return {
          success: false,
          message: errorMsg,
        };
      } finally {
        setConnectionLoading(false);
      }
    },
    [session?.user?.accessToken, isConnected, API_BASE_URL]
  );

  // Check connection status on mount and when session changes
  useEffect(() => {
    refreshConnectionStatus();
  }, [session?.user?.accessToken, refreshConnectionStatus]);


  /**
   * Share the deck as a LinkedIn document post, which the feed renders as
   * a swipeable carousel.
   *
   * The PDF is produced in the browser and uploaded as multipart: it is
   * already megabytes, and base64 in a JSON body would inflate it by a
   * third for no benefit.
   */
  const shareDeckAsCarousel = useCallback(
    async ({ pdf, message, title }: { pdf: Blob; message: string; title?: string }) => {
      if (!session?.user?.accessToken) {
        return { success: false, message: "Sign in to share" };
      }
      if (!isConnected) {
        return { success: false, message: "Connect your LinkedIn account first" };
      }

      try {
        const form = new FormData();
        form.append("file", pdf, `${(title || "presentation").replace(/[^w.-]+/g, "-")}.pdf`);
        form.append("message", message);
        if (title) form.append("title", title);

        const res = await axios.post(
          `${API_BASE_URL}/api/linkedin/share-document`,
          form,
          {
            headers: { Authorization: `Bearer ${session.user.accessToken}` },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
          }
        );
        return {
          success: true,
          message: res.data?.message || "Shared to LinkedIn",
        };
      } catch (err: any) {
        return {
          success: false,
          message:
            err?.response?.data?.error ||
            err?.message ||
            "Could not share to LinkedIn",
        };
      }
    },
    [session?.user?.accessToken, isConnected, API_BASE_URL]
  );

  const value: LinkedInContextType = {
    isConnected,
    connectionLoading,
    connectionError,
    connectionStatus,
    initiateAuth,
    handleCallback,
    disconnect,
    shareSlide,
    shareCustomContent,
    shareDeckAsCarousel,
    refreshConnectionStatus,
  };

  return (
    <LinkedInContext.Provider value={value}>
      {children}
    </LinkedInContext.Provider>
  );
};

/**
 * Hook to use LinkedIn context
 * Must be used inside LinkedInProvider
 */
export const useLinkedIn = () => {
  const context = useContext(LinkedInContext);
  if (!context) {
    throw new Error("useLinkedIn must be used inside LinkedInProvider");
  }
  return context;
};
