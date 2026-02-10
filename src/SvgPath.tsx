/* eslint-disable react/no-array-index-key */
import React, {useCallback, useEffect, useMemo} from 'react';
import {
    interpolate,
    SharedValue,
    useDerivedValue,
    useSharedValue,
    useAnimatedReaction,
} from 'react-native-reanimated';
import {PixelRatio, View} from 'react-native';
import {
    Canvas,
    Path as SkiaPath,
    Skia,
    LinearGradient as SkiaLinearGradient,
    vec,
    DashPathEffect,
    Group,
    PathDef,
    AnimatedProp,
    SkPoint,
} from '@shopify/react-native-skia';
import ActivePoint from './ActivePoint';
import EndPoint from './EndPoint';
import {
    createNewPath,
    getChartMinMaxValue,
    getIndexOfTheNearestXPoint,
    isEqual,
    PathObject,
} from './utils';
import {DataPoint, ExtraConfig, Line} from './types';
import {ACTIVE_POINT_CONFIG, END_POINT, EXTRA_CONFIG} from './defaults';
import useChartAnimation from './animations/animations';

const SvgPath = ({
    lines,
    svgHeight,
    svgWidth,
    activeTouchX,
    activeTouch,
    extraConfig,
    onPointChange,
    endSpacing,
    initialActivePoint,
    activeLineIndex,
}: {
    lines: Line[];
    svgHeight: number;
    svgWidth: number;
    activeTouchX: SharedValue<number>;
    activeTouch: SharedValue<boolean>;
    extraConfig: ExtraConfig;
    endSpacing: number;
    initialActivePoint?: number;
    onPointChange: (point?: DataPoint) => void;
    activeLineIndex: number;
}) => {
    const allData = lines.reduce((acc, line) => {
        if (line.data !== undefined) {
            if (line.data[0]?.y2 !== undefined) {
                const sideLine = line.data.map(item => {
                    return {
                        x: item.x,
                        y: item?.y2,
                    };
                });
                // @ts-ignore
                acc.concat(sideLine);
            }
            // @ts-ignore
            return acc.concat(line?.data);
        }
        return acc;
    }, []);

    const axisMinMax = useMemo(() => {
        return getChartMinMaxValue({
            allData,
            alwaysStartYAxisFromZero:
                extraConfig.alwaysStartYAxisFromZero || false,
            calculateChartYAxisMinMax:
                extraConfig.calculateChartYAxisMinMax || undefined,
            calculateChartXAxisMinMax:
                extraConfig.calculateChartXAxisMinMax || undefined,
        });
    }, [allData, lines]);

    const activeIndex = useDerivedValue(() => {
        // eslint-disable-next-line no-bitwise
        const activeTouchWithoutDecimals = ~~activeTouchX.value;

        if (activeTouchWithoutDecimals === 0 && initialActivePoint) {
            return initialActivePoint;
        }

        const data = lines[activeLineIndex]?.data || [];
        const dataLength = data.length;

        const minData = axisMinMax.minX;
        const maxData = axisMinMax.maxX;

        const denominator = svgWidth - endSpacing;
        const percentage = (activeTouchWithoutDecimals / denominator) * 100;

        const percentageToTimestampValue = interpolate(
            percentage,
            [0, 100],
            [minData, maxData],
        );

        let activeIndexLocal = getIndexOfTheNearestXPoint(
            data,
            percentageToTimestampValue,
        );

        if (activeIndexLocal >= dataLength) {
            activeIndexLocal = dataLength - 1;
        }

        return activeIndexLocal;
    }, [activeTouchX, lines[activeLineIndex]?.data]);

    return (
        <>
            {lines
                .filter(line => line?.data)
                .map((line, index) => {
                    if (line?.data) {
                        return (
                            <MemoizedLineComponent
                                key={`${index}`}
                                line={line}
                                allData={allData}
                                svgHeight={svgHeight}
                                svgWidth={svgWidth}
                                activeIndex={activeIndex}
                                activeTouch={activeTouch}
                                extraConfig={extraConfig}
                                onPointChange={
                                    index === activeLineIndex
                                        ? onPointChange
                                        : undefined
                                }
                                axisMinMax={axisMinMax}
                            />
                        );
                    }
                    // @ts-ignore
                    return <View key={`${index}`} />;
                })}
        </>
    );
};

const LineComponent = ({
    line,
    allData,
    svgHeight,
    svgWidth,
    activeTouch,
    activeIndex,
    extraConfig,
    onPointChange,
    axisMinMax,
}: {
    line: Line;
    allData: DataPoint[];
    svgHeight: number;
    svgWidth: number;
    activeTouch: SharedValue<boolean>;
    activeIndex: SharedValue<number>;
    extraConfig: ExtraConfig;
    onPointChange?: (point?: DataPoint) => void;
    axisMinMax: ReturnType<typeof getChartMinMaxValue>;
}) => {
    const isLineColorGradient = Array.isArray(line.lineColor);
    const isRangedLineChart = line.data[0]?.y2 !== undefined;

    const getActivePointColor = useCallback(() => {
        if (line.activePointConfig?.color) {
            return line.activePointConfig.color;
        }
        if (!isLineColorGradient) {
            return line.lineColor as string;
        }
        return ACTIVE_POINT_CONFIG.color;
    }, [line?.activePointConfig?.color, line?.lineColor, isLineColorGradient]);

    const localCreateNewPath = () => {
        return createNewPath({
            data: line?.data || [],
            endSpacing:
                extraConfig.endSpacing === undefined
                    ? EXTRA_CONFIG.endSpacing
                    : extraConfig.endSpacing,
            svgHeight,
            svgWidth,
            isFilled: line.isAreaChart === true,
            curve: line.curve,
            axisMinMax,
        });
    };

    const [localPath, setLocalPath] = React.useState<PathObject>(
        localCreateNewPath(),
    );

    const {startAnimation, derivedPathString, endPointAnimation} =
        useChartAnimation({
            duration: extraConfig.animationConfig?.duration || 0,
            animationType: extraConfig.animationConfig?.animationType || 'fade',
            path: localPath,
        });

    useEffect(() => {
        const path = localCreateNewPath();

        if (extraConfig.animationConfig && startAnimation) {
            startAnimation({
                action: () => {
                    setLocalPath(path);
                },
            });
        } else {
            setLocalPath(path);
        }
    }, [
        line?.data
            .map(item => {
                if (item.y2) {
                    return `${item.y}${item.y2}`;
                }
                return item?.y;
            })
            .join(''),
        line.curve,
        line.key,
        allData,
    ]);

    // Static Skia path (used when no transition animation)
    const staticSkiaPath = useMemo(() => {
        if (localPath?.d) {
            return Skia.Path.MakeFromSVGString(localPath.d);
        }
        return null;
    }, [localPath?.d]);

    // Animated Skia path (used during transition animations)
    const animatedSkiaPathSV = useSharedValue<ReturnType<
        typeof Skia.Path.MakeFromSVGString
    > | null>(staticSkiaPath);

    // Sync animated path from derivedPathString on the UI thread
    useAnimatedReaction(
        () => derivedPathString?.value,
        currentPathStr => {
            if (currentPathStr) {
                const p = Skia.Path.MakeFromSVGString(currentPathStr);
                if (p) {
                    animatedSkiaPathSV.value = p;
                }
            }
        },
        [derivedPathString],
    );

    // When no animation, keep the shared value in sync with static path
    React.useEffect(() => {
        if (!derivedPathString && staticSkiaPath) {
            animatedSkiaPathSV.value = staticSkiaPath;
        }
    }, [staticSkiaPath, derivedPathString]);

    // Use animated path when transitions are active, static otherwise
    const skiaPath = derivedPathString ? animatedSkiaPathSV : staticSkiaPath;

    const applyOpacityToColor = useCallback(
        (color: string, opacity: number): string => {
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
        },
        [],
    );

    const {pathStartX, pathEndX} = useMemo(() => {
        const pathStartX = line?.data[0]?.x
            ? localPath?.x(line?.data[0]?.x)
            : 0;
        const pathEndX = line?.data[line?.data?.length - 1]?.x
            ? localPath?.x(line?.data[line?.data?.length - 1]?.x || 0)
            : svgWidth;
        return {
            pathStartX,
            pathEndX,
        };
    }, []);

    const skiaGradient = useMemo(() => {
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
        applyOpacityToColor,
    ]);

    const {canvasWidth, canvasHeight, scaleFactor} = useMemo(() => {
        const MAX_TEXTURE_SIZE = 4096;
        const pr = PixelRatio.get();
        const sf = Math.min(
            1,
            MAX_TEXTURE_SIZE / (svgWidth * pr),
            MAX_TEXTURE_SIZE / (svgHeight * pr),
        );
        return {
            canvasWidth: Math.floor(svgWidth * sf),
            canvasHeight: Math.floor(svgHeight * sf),
            scaleFactor: sf,
        };
    }, [svgWidth, svgHeight]);

    const parseDashArray = useCallback((dashArray: any): number[] => {
        if (Array.isArray(dashArray)) return dashArray.map(Number);
        if (typeof dashArray === 'string')
            return dashArray.split(/[\s,]+/).map(Number);
        if (typeof dashArray === 'number') return [dashArray, dashArray];
        return [];
    }, []);

    return (
        <>
            {skiaPath && (
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
                                    scaleX:
                                        scaleFactor < 1 ? 1 / scaleFactor : 1,
                                },
                                {
                                    scaleY:
                                        scaleFactor < 1 ? 1 / scaleFactor : 1,
                                },
                            ],
                        }}
                    >
                        <Group
                            transform={
                                scaleFactor < 1
                                    ? [
                                          {scaleX: scaleFactor},
                                          {scaleY: scaleFactor},
                                      ]
                                    : []
                            }
                        >
                            <SkiaPath
                                path={skiaPath as PathDef}
                                style="stroke"
                                strokeWidth={
                                    line.lineWidth === 0
                                        ? 0.01
                                        : (line.lineWidth ?? 2)
                                } // for some reason it doesn't accept zero
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
                                    parseDashArray(line.strokeDasharray)
                                        .length >= 2 && (
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
            )}

            {line.endPointConfig && endPointAnimation && (
                <EndPoint
                    x={localPath?.x(
                        localPath?.data[localPath.data.length - 1]?.x || 0,
                    )}
                    y={localPath?.y(
                        localPath?.data[localPath.data.length - 1]?.y || 0,
                    )}
                    color={line.endPointConfig?.color || END_POINT.color}
                    animated={
                        line.endPointConfig?.animated || END_POINT.animated
                    }
                    radius={line.endPointConfig?.radius || END_POINT.radius}
                    endPointAnimation={endPointAnimation}
                />
            )}

            {line !== undefined && line.activePointConfig !== undefined && (
                <ActivePoint
                    data={localPath?.data || []}
                    activeTouch={activeTouch}
                    width={svgWidth}
                    height={svgHeight}
                    activePointComponent={line.activePointComponent}
                    activePointComponentWithSharedValue={
                        line.activePointComponentWithSharedValue
                    }
                    activeIndex={activeIndex}
                    path={localPath}
                    onPointChange={onPointChange}
                    color={getActivePointColor()}
                    borderColor={
                        line?.activePointConfig?.borderColor ||
                        ACTIVE_POINT_CONFIG.borderColor
                    }
                    borderWidth={
                        line?.activePointConfig?.borderWidth !== undefined &&
                        line?.activePointConfig?.borderWidth >= 0
                            ? line?.activePointConfig?.borderWidth
                            : ACTIVE_POINT_CONFIG.borderWidth
                    }
                    showVerticalLine={
                        line?.activePointConfig?.showVerticalLine !== undefined
                            ? line?.activePointConfig?.showVerticalLine
                            : ACTIVE_POINT_CONFIG.showVerticalLine
                    }
                    showActivePointCircle={
                        line?.activePointConfig?.showActivePointCircle !==
                        undefined
                            ? line?.activePointConfig?.showActivePointCircle
                            : ACTIVE_POINT_CONFIG.showActivePointCircle
                    }
                    verticalLineColor={
                        line?.activePointConfig?.verticalLineColor ||
                        ACTIVE_POINT_CONFIG.verticalLineColor
                    }
                    verticalLineWidth={
                        line?.activePointConfig?.verticalLineWidth ||
                        ACTIVE_POINT_CONFIG.verticalLineWidth
                    }
                    verticalLineDashArray={
                        line?.activePointConfig?.verticalLineDashArray ||
                        ACTIVE_POINT_CONFIG.verticalLineDashArray
                    }
                    verticalLineOpacity={
                        line?.activePointConfig?.verticalLineOpacity ||
                        ACTIVE_POINT_CONFIG.verticalLineOpacity
                    }
                    animateTransition={
                        line?.activePointConfig?.animateTransition !== undefined
                            ? line?.activePointConfig?.animateTransition
                            : ACTIVE_POINT_CONFIG.animateTransition
                    }
                    radius={
                        line?.activePointConfig?.radius ||
                        ACTIVE_POINT_CONFIG.radius
                    }
                />
            )}
        </>
    );
};

const MemoizedLineComponent = React.memo(LineComponent, (prev, next) => {
    return (
        prev.line.data.length === next.line.data.length &&
        prev.line.curve === next.line.curve &&
        prev.line.lineColor === next.line.lineColor &&
        prev.line.key === next.line.key &&
        isEqual(prev.line.activePointConfig, next.line.activePointConfig) &&
        prev.allData
            .map(item => {
                if (item?.y2 !== undefined) {
                    return `${item.y}${item.y2}`;
                }
                return item?.y;
            })
            .join('') ===
            next.allData
                .map(item => {
                    if (item?.y2 !== undefined) {
                        return `${item.y}${item.y2}`;
                    }
                    return item?.y;
                })
                .join('')
    );
});

export default SvgPath;
