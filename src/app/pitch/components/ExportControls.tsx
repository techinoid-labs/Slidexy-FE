import React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SlideshowIcon from "@mui/icons-material/Slideshow";

interface ExportControlsProps {
    exporting: boolean;
    onExport: (format: "pdf" | "pptx" | "png") => void;
}

const ExportControls: React.FC<ExportControlsProps> = ({ exporting, onExport }) => {
    return (
        <div className="flex gap-3">
            <button
                onClick={() => onExport("png")}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FileDownloadIcon fontSize="small" />
                <span className="text-sm font-medium">PNG</span>
            </button>
            <button
                onClick={() => onExport("pdf")}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <PictureAsPdfIcon fontSize="small" className="text-red-500" />
                <span className="text-sm font-medium">{exporting ? "Exporting..." : "PDF"}</span>
            </button>
            <button
                onClick={() => onExport("pptx")}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SlideshowIcon fontSize="small" className="text-orange-500" />
                <span className="text-sm font-medium">{exporting ? "Exporting..." : "PPTX"}</span>
            </button>
        </div>
    );
};

export default ExportControls;
