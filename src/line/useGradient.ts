import {useMemo} from 'react';
import {Skia, vec} from '@shopify/react-native-skia';
import {Line} from '../types';

interface UseGradientParams {
    line: Line;
    svgHeight: number;
    pathStartX: number;
    pathEndX: number;
    isLineColorGradient: boolean;
}

export const useGradient = ({
    line,
    svgHeight,
    pathStartX,
    pathEndX,
    isLineColorGradient,
}: UseGradientParams) => {
    return useMemo(() => {
        const getLeadingOpacity = () => {
            if (line.leadingOpacity === undefined) return 1;
            if (typeof line.leadingOpacity === 'object')
                return line.leadingOpacity.opacity;
            return Number(line.leadingOpacity);
        };

        const getTrailingOpacity = () => {
            if (line.trailingOpacity === undefined) return 1;
            if (typeof line.trailingOpacity === 'object')
                return line.trailingOpacity.opacity;
            return Number(line.trailingOpacity);
        };

        let colors: string[];
        let positions: number[];

        if (isLineColorGradient) {
            const gradientColors = line.lineColor as string[];
            const n = gradientColors.length;
            colors = gradientColors.map((color, index) => {
                if (index === 0)
                    return applyOpacityToColor(color, getLeadingOpacity());
                if (index === n - 1)
                    return applyOpacityToColor(color, getTrailingOpacity());
                return color;
            });
            positions = gradientColors.map((_, index) => index / (n - 1));
        } else {
            const color = (line.lineColor as string) || 'black';
            const leadingOp = getLeadingOpacity();
            const trailingOp = getTrailingOpacity();

            let pos1 = 0.5;
            if (
                typeof line.leadingOpacity === 'object' &&
                line.leadingOpacity.leadingPercentage
            ) {
                pos1 = line.leadingOpacity.leadingPercentage / 200;
            }

            let pos2 = 0.5;
            if (
                typeof line.trailingOpacity === 'object' &&
                line.trailingOpacity.trailingPercentage
            ) {
                pos2 = 1 - line.trailingOpacity.trailingPercentage / 200;
            }

            colors = [
                applyOpacityToColor(color, leadingOp),
                color,
                color,
                applyOpacityToColor(color, trailingOp),
            ];
            positions = [0, pos1, pos2, 1];
        }

        // Gradient direction
        let start: typeof vec;
        let end: typeof vec | null;
        if (line.opacityDirection === 'vertical') {
            start = vec(0, svgHeight) as unknown as typeof vec;
            end = vec(0, 0) as unknown as typeof vec;
        } else {
            start = vec(pathStartX, 0) as unknown as typeof vec;
            end = vec(pathEndX, 0) as unknown as typeof vec;
        }

        return {colors, positions, start, end};
    }, [
        line.lineColor,
        line.leadingOpacity,
        line.trailingOpacity,
        line.opacityDirection,
        pathStartX,
        pathEndX,
        svgHeight,
        isLineColorGradient,
    ]);
};

export const applyOpacityToColor = (color: string, opacity: number): string => {
    try {
        const c = Skia.Color(color);
        if (
            !c ||
            c[0] === undefined ||
            c[1] === undefined ||
            c[2] === undefined ||
            c[3] === undefined
        ) {
            return color;
        }
        const r = Math.round(c[0] * 255);
        const g = Math.round(c[1] * 255);
        const b = Math.round(c[2] * 255);
        const a = opacity * c[3];
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    } catch {
        return color;
    }
};

export const parseDashArray = (dashArray: any): number[] => {
    if (Array.isArray(dashArray)) return dashArray.map(Number);
    if (typeof dashArray === 'string')
        return dashArray.split(/[\s,]+/).map(Number);
    if (typeof dashArray === 'number') return [dashArray, dashArray];
    return [];
};
