import { useEffect } from 'react';

export const useAgentTheme = (primaryColor?: string) => {
    useEffect(() => {
        if (!primaryColor) return;

        // Convert hex to rgb
        const hexToRgb = (hex: string) => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
                : '57 255 20';
        };

        const rgb = hexToRgb(primaryColor);
        document.documentElement.style.setProperty('--neon-green', rgb);

        // Also update selection color which is hardcoded in some layouts
        // Actually, selection style is usually in CSS. 
        // We can inject a style tag if needed, but for now CSS variable update is enough if we use the variable in CSS.

    }, [primaryColor]);
};
