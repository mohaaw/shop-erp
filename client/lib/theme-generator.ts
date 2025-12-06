import chroma from 'chroma-js';

export interface ThemeColors {
    [key: string]: string;
}

export function generateThemeColors(baseColor: string, name: string): ThemeColors {
    const colors: ThemeColors = {};
    const scale = chroma.scale([
        chroma(baseColor).brighten(2.5),
        baseColor,
        chroma(baseColor).darken(2.5)
    ]).mode('lch').colors(11); // 50, 100, ..., 900, 950

    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    shades.forEach((shade, index) => {
        colors[`--${name}-${shade}`] = scale[index];
    });

    return colors;
}

export function applyTheme(primary: string, secondary: string) {
    const root = document.documentElement;

    const primaryColors = generateThemeColors(primary, 'primary');
    const secondaryColors = generateThemeColors(secondary, 'secondary');

    Object.entries(primaryColors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });

    Object.entries(secondaryColors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}
