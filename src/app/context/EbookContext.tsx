"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface EbookContextType {
  pdfUrl: string | null;  // Object URL
  setPdfBlob: (blob: Blob | null) => void;  // Store blob
}

const EbookContext = createContext<EbookContextType>({
  pdfUrl: null,
  setPdfBlob: () => {},
});

export const EbookProvider = ({ children }: { children: ReactNode }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    // Restore from sessionStorage
    const storedData = sessionStorage.getItem("ebookPdfBase64");
    if (storedData) {
      const byteCharacters = atob(storedData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    }
  }, []);

  const setPdfBlob = (blob: Blob | null) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      // Convert blob to base64 and save in sessionStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = (reader.result as string).split(",")[1]; // remove data: prefix
        sessionStorage.setItem("ebookPdfBase64", base64data);
      };
      reader.readAsDataURL(blob);
    } else {
      setPdfUrl(null);
      sessionStorage.removeItem("ebookPdfBase64");
    }
  };

  return (
    <EbookContext.Provider value={{ pdfUrl, setPdfBlob }}>
      {children}
    </EbookContext.Provider>
  );
};

export const useEbook = () => useContext(EbookContext);
