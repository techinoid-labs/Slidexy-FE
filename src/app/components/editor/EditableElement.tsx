"use client";
import React, { useRef, useEffect, useState } from "react";

interface EditableElementProps {
    id: string; // Element ID for updates
    text: string;
    isEditing: boolean;
    tagName?: "h1" | "h2" | "h3" | "p" | "div" | "blockquote" | "cite" | "span";
    placeholder?: string;
    className?: string; // CSS class for styling
    style?: React.CSSProperties; // Inline styles
    onChange?: (newText: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    onSelectElement?: () => void; // callback to sync selection panels
    elementProperties?: any; // Element properties from slide data (fontSize, fontFamily, fill, etc.)
}

/**
 * A generic editable element wrapper.
 * Renders as a standard HTML tag when not in editing mode.
 * Renders as a contentEditable element when in editing mode.
 */
export const EditableElement: React.FC<EditableElementProps> = ({
    id,
    text,
    isEditing,
    tagName = "div",
    placeholder = "Type here...",
    className = "",
    style = {},
    onChange,
    onBlur,
    onFocus,
    onSelectElement,
    elementProperties,
}) => {
    const contentRef = useRef<HTMLElement>(null);
    const [localText, setLocalText] = useState(text);

    // Helper: Convert element properties to CSS styles
    const getStyleFromProperties = (): React.CSSProperties => {
        if (!elementProperties) return {};

        const cssStyle: React.CSSProperties = {};

        // Font properties
        if (elementProperties.fontSize) cssStyle.fontSize = `${elementProperties.fontSize}px`;
        if (elementProperties.fontFamily) cssStyle.fontFamily = elementProperties.fontFamily;
        if (elementProperties.fontWeight) cssStyle.fontWeight = elementProperties.fontWeight;
        if (elementProperties.fontStyle) cssStyle.fontStyle = elementProperties.fontStyle;

        // Color
        if (elementProperties.fill) cssStyle.color = elementProperties.fill;

        // Alignment
        if (elementProperties.align) cssStyle.textAlign = elementProperties.align as any;

        // Opacity
        if (elementProperties.opacity !== undefined) cssStyle.opacity = elementProperties.opacity;

        // Line height
        if (elementProperties.lineHeight) cssStyle.lineHeight = elementProperties.lineHeight;

        return cssStyle;
    };

    // Sync with prop updates IF not currently focused (to avoid cursor jumps)
    useEffect(() => {
        if (contentRef.current && document.activeElement !== contentRef.current) {
            if (contentRef.current.innerText !== text) {
                setLocalText(text);
                contentRef.current.innerText = text;
            }
        }
    }, [text]);

    const handleInput = (e: React.FormEvent<HTMLElement>) => {
        const newText = e.currentTarget.innerText;
        setLocalText(newText);
        if (onChange) {
            onChange(newText);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        if (onBlur) onBlur();
    };

    const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
        if (onFocus) onFocus();
        if (onSelectElement) onSelectElement();
    };

    // Tag creation
    const Tag = tagName as any;

    if (!isEditing) {
        // Read-only mode: Element properties override layout styles
        const mergedStyle = { ...style, ...getStyleFromProperties(), whiteSpace: 'pre-wrap' };
        return (
            <Tag className={className} style={mergedStyle}>
                {text || placeholder}
            </Tag>
        )
    }

    // Editing mode: Element properties override layout styles
    const mergedStyle = {
        ...style,
        ...getStyleFromProperties(),
        minWidth: "1em",
        minHeight: "1em",
        whiteSpace: "pre-wrap",
        display: style.display || "block",
    };

    return (
        <Tag
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className={`${className} outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded px-1 transition-shadow duration-200 cursor-text empty:before:content-[attr(placeholder)] empty:before:text-gray-400`}
            style={mergedStyle}
            placeholder={placeholder}
            onInput={handleInput}
            onBlur={handleBlur}
            onFocus={handleFocus}
        >
            {/* Initial text render is handled by ref manipulation in useEffect or dangeriouslySetInnerHTML, 
            Usage of children in contentEditable can vary. 
            Using valid React pattern for CE: */}
            {text}
        </Tag>
    );
};
