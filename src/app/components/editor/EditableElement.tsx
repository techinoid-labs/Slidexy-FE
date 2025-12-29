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
    const getStyleFromProperties = (props = elementProperties): React.CSSProperties => {
        if (!props) return {};

        const cssStyle: React.CSSProperties = {};

        // Font properties
        if (props.fontSize) cssStyle.fontSize = `${props.fontSize}px`;
        if (props.fontFamily) cssStyle.fontFamily = props.fontFamily;
        if (props.fontWeight) cssStyle.fontWeight = props.fontWeight;
        if (props.fontStyle) cssStyle.fontStyle = props.fontStyle;

        // Color
        if (props.fill) cssStyle.color = props.fill;

        // Alignment
        if (props.align) cssStyle.textAlign = props.align as any;

        // Opacity
        if (props.opacity !== undefined) cssStyle.opacity = props.opacity;

        // Line height
        if (props.lineHeight) cssStyle.lineHeight = props.lineHeight;

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

    // DATA MIGRATION: Fix old italic data stored as fontWeight instead of fontStyle
    // Create corrected copy to avoid mutating Redux state
    const correctedProperties = elementProperties?.fontWeight === 'italic'
        ? { ...elementProperties, fontStyle: 'italic', fontWeight: 'normal' }
        : elementProperties;

    // Editing mode: Element properties override layout styles
    const mergedStyle = {
        ...style,
        minWidth: style.minWidth || "1em",
        minHeight: "1em",
        whiteSpace: "pre-wrap",
        display: style.display || "block",
        ...getStyleFromProperties(correctedProperties), // ← Element properties LAST so they override everything
    };

    // Extract textAlign for wrapper (since textAlign on contentEditable doesn't work well in flex)
    const { textAlign, flex, ...contentStyle } = mergedStyle;

    // Map textAlign to alignItems for the flex wrapper
    const alignToFlexMap: Record<string, string> = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
        justify: 'stretch'
    };
    const alignItems = alignToFlexMap[textAlign as string] || 'flex-start';

    // Wrapper should have width: 100% to ensure it can fill its parent and align content correctly
    const wrapperStyle: React.CSSProperties = {
        textAlign: (textAlign as any) || 'left',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: alignItems as any,
        flex: flex, // Only use flex if provided
        maxWidth: '100%'
    };

    return (
        <div style={wrapperStyle}>
            <Tag
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                className={`${className} outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded px-1 transition-shadow duration-200 cursor-text empty:before:content-[attr(placeholder)] empty:before:text-gray-400`}
                style={{ ...contentStyle, textAlign: (textAlign as any) || 'left', width: 'auto', maxWidth: '100%' }}
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
        </div>
    );
};
