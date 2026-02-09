import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface SlideNavigationProps {
    currentIndex: number;
    slideCount: number;
    exporting: boolean;
    onPrev: () => void;
    onNext: () => void;
}

const SlideNavigation: React.FC<SlideNavigationProps> = ({
    currentIndex,
    slideCount,
    exporting,
    onPrev,
    onNext,
}) => {
    return (
        <div className="flex items-center gap-6 bg-white shadow-md px-6 py-3 rounded-2xl border border-gray-100">
            <button
                disabled={currentIndex === 0 || exporting}
                onClick={onPrev}
                className={`flex items-center justify-center p-2 rounded-full transition-all ${
                    currentIndex === 0 || exporting
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
                title="Previous Slide"
            >
                <ChevronLeftIcon />
            </button>

            <span className="text-lg font-semibold text-gray-700 min-w-[80px] text-center">
                {currentIndex + 1} <span className="text-gray-400 font-normal mx-1">/</span> {slideCount}
            </span>

            <button
                disabled={currentIndex === slideCount - 1 || exporting}
                onClick={onNext}
                className={`flex items-center justify-center p-2 rounded-full transition-all ${
                    currentIndex === slideCount - 1 || exporting
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
                title="Next Slide"
            >
                <ChevronRightIcon />
            </button>
        </div>
    );
};

export default SlideNavigation;
