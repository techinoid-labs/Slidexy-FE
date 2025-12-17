"use client";
import React from 'react';
import { useTypewriter } from '@/app/hooks/useTypewriter';

interface AnimatedTextProps {
    children: string;
    delay?: number;
    speed?: number;
    effect?: 'typewriter' | 'fade' | 'none';
    className?: string;
}

/**
 * Animated text component with typewriter and fade effects
 * Used for Gamma-style text animations
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
    children,
    delay = 0,
    speed = 50,
    effect = 'typewriter',
    className = '',
}) => {
    const { displayText, isComplete } = useTypewriter(
        children,
        { speed, delay }
    );

    if (effect === 'none') {
        return <span className={className}>{children}</span>;
    }

    if (effect === 'fade') {
        return (
            <span
                className={`fade-in-up ${className}`}
                style={{ animationDelay: `${delay}ms` }}
            >
                {children}
            </span>
        );
    }

    // Typewriter effect
    return (
        <span className={`typewriter-text ${isComplete ? 'complete' : ''} ${className}`}>
            {displayText}
            {!isComplete && <span className="cursor">|</span>}
        </span>
    );
};

interface GammaCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'elevated';
    hover?: boolean;
}

/**
 * Gamma-style card component with glassmorphism and elevation
 */
export const GammaCard: React.FC<GammaCardProps> = ({
    children,
    className = '',
    variant = 'default',
    hover = true,
}) => {
    const variantClasses = {
        default: 'gamma-card',
        glass: 'gamma-card glass-effect',
        elevated: 'gamma-card elevated-card',
    };

    return (
        <div className={`${variantClasses[variant]} ${hover ? 'hover-lift' : ''} ${className}`}>
            {children}
        </div>
    );
};

interface GradientBackgroundProps {
    variant?: 1 | 2 | 3;
    children?: React.ReactNode;
    className?: string;
}

/**
 * Gamma-style gradient background
 */
export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    variant = 1,
    children,
    className = '',
}) => {
    const gradientClass = `gamma-gradient-${variant}`;

    return (
        <div className={`${gradientClass} ${className}`}>
            {children}
        </div>
    );
};
