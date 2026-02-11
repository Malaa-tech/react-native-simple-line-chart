/* eslint-disable react/no-array-index-key */
import React, {useCallback, useEffect, useMemo} from 'react';
import {SharedValue} from 'react-native-reanimated';
import {View} from 'react-native';
import ActivePoint from './activePoint/ActivePoint';
import EndPoint from './EndPoint';
import {
    createNewPath,
    getChartMinMaxValue,
    isEqual,
    PathObject,
    useActiveIndex,
} from './utils';
import {DataPoint, ExtraConfig, Line} from './types';
import {ACTIVE_POINT_CONFIG, END_POINT, EXTRA_CONFIG} from './defaults';
import useChartAnimation from './animations/animations';
import {useSkiaPath, useGradient, SkiaCanvas} from './line';

const ChartWrapper = ({
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

    const activeIndex = useActiveIndex({
        activeTouchX,
        lines,
        activeLineIndex,
        axisMinMax,
        svgWidth,
        endSpacing,
        initialActivePoint,
    });

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

    const skiaPath = useSkiaPath({
        localPath,
        derivedPathString,
    });

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

    const skiaGradient = useGradient({
        line,
        svgHeight,
        pathStartX,
        pathEndX,
        isLineColorGradient,
    });

    return (
        <>
            <SkiaCanvas
                skiaPath={skiaPath}
                line={line}
                svgWidth={svgWidth}
                svgHeight={svgHeight}
                skiaGradient={skiaGradient}
                isRangedLineChart={isRangedLineChart}
            />

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

export default ChartWrapper;
