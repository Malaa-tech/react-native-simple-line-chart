import React from 'react';
import {PixelRatio, View} from 'react-native';
import {
    Canvas,
    Path as SkiaPath,
    LinearGradient as SkiaLinearGradient,
    DashPathEffect,
    Group,
    PathDef,
    AnimatedProp,
    SkPoint,
} from '@shopify/react-native-skia';
import {Line} from '../types';
import {parseDashArray} from './useGradient';

interface SkiaCanvasProps {
    skiaPath: any;
    line: Line;
    svgWidth: number;
    svgHeight: number;
    skiaGradient: {
        colors: string[];
        positions: number[];
        start: any;
        end: any;
    };
    isRangedLineChart: boolean;
    maxTextureSize?: number;
}

export const SkiaCanvas: React.FC<SkiaCanvasProps> = ({
    skiaPath,
    line,
    svgWidth,
    svgHeight,
    skiaGradient,
    isRangedLineChart,
    maxTextureSize = 4096,
}) => {
    const {canvasWidth, canvasHeight, scaleFactor} = React.useMemo(() => {
        const pr = PixelRatio.get();
        const sf = Math.min(
            1,
            maxTextureSize / (svgWidth * pr),
            maxTextureSize / (svgHeight * pr),
        );
        return {
            canvasWidth: Math.floor(svgWidth * sf),
            canvasHeight: Math.floor(svgHeight * sf),
            scaleFactor: sf,
        };
    }, [svgWidth, svgHeight, maxTextureSize]);

    if (!skiaPath) return null;

    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: svgWidth,
                height: svgHeight,
            }}
            pointerEvents="none"
        >
            <Canvas
                style={{
                    position: 'absolute',
                    left: (svgWidth - canvasWidth) / 2,
                    top: (svgHeight - canvasHeight) / 2,
                    width: canvasWidth,
                    height: canvasHeight,
                    transform: [
                        {
                            scaleX: scaleFactor < 1 ? 1 / scaleFactor : 1,
                        },
                        {
                            scaleY: scaleFactor < 1 ? 1 / scaleFactor : 1,
                        },
                    ],
                }}
            >
                <Group
                    transform={
                        scaleFactor < 1
                            ? [{scaleX: scaleFactor}, {scaleY: scaleFactor}]
                            : []
                    }
                >
                    <SkiaPath
                        path={skiaPath as PathDef}
                        style="stroke"
                        strokeWidth={
                            line.lineWidth === 0 ? 0.01 : (line.lineWidth ?? 2)
                        }
                        strokeCap="round"
                    >
                        <SkiaLinearGradient
                            start={
                                skiaGradient.start as unknown as AnimatedProp<SkPoint>
                            }
                            end={
                                skiaGradient.end as unknown as AnimatedProp<SkPoint>
                            }
                            colors={skiaGradient.colors}
                            positions={skiaGradient.positions}
                        />
                        {line.strokeDasharray &&
                            parseDashArray(line.strokeDasharray).length >=
                                2 && (
                                <DashPathEffect
                                    intervals={parseDashArray(
                                        line.strokeDasharray,
                                    )}
                                />
                            )}
                    </SkiaPath>
                    {((line.isAreaChart !== undefined &&
                        line.isAreaChart === true) ||
                        isRangedLineChart) && (
                        <SkiaPath
                            path={skiaPath as PathDef}
                            style="fill"
                            opacity={line?.fillOpacity ?? 1}
                        >
                            <SkiaLinearGradient
                                start={
                                    skiaGradient.start as unknown as AnimatedProp<SkPoint>
                                }
                                end={
                                    skiaGradient.end as unknown as AnimatedProp<SkPoint>
                                }
                                colors={skiaGradient.colors}
                                positions={skiaGradient.positions}
                            />
                        </SkiaPath>
                    )}
                </Group>
            </Canvas>
        </View>
    );
};
