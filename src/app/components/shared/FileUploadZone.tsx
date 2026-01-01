"use client";

import React, { useRef } from 'react';
import { IconButton, Chip, Box } from '@mui/material';

interface FileUploadZoneProps {
    selectedFile: File | null;
    onFileSelect: (file: File) => void;
    onFileRemove: () => void;
    onError: (error: string) => void;
    disabled?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
    selectedFile,
    onFileSelect,
    onFileRemove,
    onError,
    disabled = false,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 20 * 1024 * 1024) {
                onError("File too large. Max limit is 20MB.");
                return;
            }
            onFileSelect(file);
            onError("");
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".pdf,.txt,.doc,.docx,image/jpeg,image/png,image/webp"
            />
            <IconButton
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                sx={{
                    p: 0,
                    "&:hover": { backgroundColor: "transparent" },
                }}
            >
                <img
                    src="/file-upload-icon.svg"
                    alt="Upload File"
                    style={{ width: 20, height: 20 }}
                />
            </IconButton>

            {selectedFile && (
                <Chip
                    label={selectedFile.name}
                    onDelete={onFileRemove}
                    disabled={disabled}
                    sx={{
                        maxWidth: "150px",
                        height: "32px",
                        backgroundColor: "rgba(108, 43, 217, 0.1)",
                        color: "#6C2BD9",
                        "& .MuiChip-deleteIcon": {
                            color: "#6C2BD9",
                        },
                    }}
                />
            )}
        </Box>
    );
};

export default FileUploadZone;
