import { useState, useEffect } from 'react';

interface TypewriterOptions {
    speed?: number;
    delay?: number;
    loop?: boolean;
}

/**
 * Typewriter effect hook - creates Gamma-style text animation
 * @param text - The text to animate
 * @param options - Configuration options
 * @returns Object with displayText and animation state
 */
export const useTypewriter = (
    text: string,
    options: TypewriterOptions = {}
) => {
    const { speed = 50, delay = 0, loop = false } = options;

    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // Reset on text change
        setDisplayText('');
        setIsComplete(false);
        setIsTyping(false);

        // Start after delay
        const delayTimer = setTimeout(() => {
            setIsTyping(true);
            let index = 0;

            const typeInterval = setInterval(() => {
                if (index < text.length) {
                    setDisplayText(text.slice(0, index + 1));
                    index++;
                } else {
                    setIsComplete(true);
                    setIsTyping(false);
                    clearInterval(typeInterval);

                    // Loop if enabled
                    if (loop) {
                        setTimeout(() => {
                            setDisplayText('');
                            setIsComplete(false);
                            index = 0;
                        }, 2000);
                    }
                }
            }, speed);

            return () => clearInterval(typeInterval);
        }, delay);

        return () => clearTimeout(delayTimer);
    }, [text, speed, delay, loop]);

    return { displayText, isComplete, isTyping };
};

/**
 * Stagger animation hook - creates delayed animations for lists
 * @param count - Number of items
 * @param baseDelay - Base delay in ms
 * @param staggerDelay - Delay between items in ms
 * @returns Array of delays for each item
 */
export const useStaggerAnimation = (
    count: number,
    baseDelay: number = 0,
    staggerDelay: number = 100
) => {
    return Array.from({ length: count }, (_, i) => baseDelay + i * staggerDelay);
};
