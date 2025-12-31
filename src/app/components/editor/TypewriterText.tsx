"use client";
import React from 'react';

interface TypewriterTextProps {
    text: string;
    className?: string;
    tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span';
    delay?: number;
    speed?: number; // Duration per character in seconds (kept for compatibility but not used)
    style?: React.CSSProperties;
    onClick?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    className = '',
    tagName = 'div',
    style = {},
    onClick
}) => {
    const Tag = tagName as React.ElementType;

    return (
        <Tag
            className={className}
            style={style}
            onClick={onClick}
        >
            {text}
        </Tag>
    );
};
