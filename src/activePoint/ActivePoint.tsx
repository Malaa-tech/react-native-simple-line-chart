import React, {useEffect} from 'react';
import {ColorValue, I18nManager} from 'react-native';
import Animated, {
    SharedValue,
    startMapper,
    stopMapper,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import ActivePointComponentWrapper from './ActivePointComponentWrapper';
import {
    ActivePointComponent,
    ActivePointComponentSharedValue,
    DataPoint,
    DataPointSharedValue,
} from '../types';
import {PathObject, useForceReRender} from '../utils';
import {scheduleOnRN} from 'react-native-worklets';

type PositionSharedValue = {x: number; y: number; y2?: number};

type ActiveState = {activeIndex: number; activeTouch: boolean};

const ActivePoint = ({
    data,
    activeTouch,
    width,
    height,
    activePointComponent,
    activePointComponentWithSharedValue,
    activeIndex,
    path,
    onPointChange,
    externalActivePointSharedValue,
    color,
    borderColor,
    borderWidth,
    radius,
    showVerticalLine,
    showActivePointCircle,
    verticalLineColor,
    verticalLineOpacity,
    verticalLineWidth,
    verticalLineDashArray,
    animateTransition,
}: {
    data: DataPoint[];
    activeTouch: SharedValue<boolean>;
    width: number;
    height: number;
    activePointComponent?: ActivePointComponent;
    activePointComponentWithSharedValue?: ActivePointComponentSharedValue;
    activeIndex: SharedValue<number>;
    path: PathObject;
    onPointChange?: (point: DataPoint) => void;
    externalActivePointSharedValue?: DataPointSharedValue;
    color: ColorValue;
    borderColor: ColorValue;
    borderWidth: number;
    radius: number;
    showVerticalLine: boolean;
    showActivePointCircle: boolean;
    verticalLineColor: ColorValue;
    verticalLineOpacity: number;
    verticalLineWidth: number;
    verticalLineDashArray: number[];
    animateTransition: boolean;
}) => {
    const isRTL = I18nManager.isRTL;
    const positions = useSharedValue<PositionSharedValue[]>([]);
    const activePointSV = useSharedValue<DataPoint | undefined>({
        x: 0,
        y: 0,
        extraData: {
            isInitialPoint: true,
            date: undefined,
        },
    });
    const pointOpacity = useSharedValue(0);
    const lineOpacitySV = useSharedValue(0);
    const activePointPositionX = useSharedValue(-radius);
    const activePointPositionY = useSharedValue(-radius);
    const forceRerender = useForceReRender();

    // forcing a re-render after x ms to fix sharedValues not causing a rerender.
    useEffect(() => {
        setTimeout(() => {
            forceRerender();
        }, 200);
    }, []);

    useEffect(() => {
        const newPositions: PositionSharedValue[] = [];
        data.forEach(item => {
            const y =
                item?.y2 !== undefined
                    ? path.y(item.y - item.y2) // check for ranged chart
                    : path.y(item.y);
            const x = path.x(item.x);

            if (x !== undefined && y !== undefined) {
                newPositions.push({
                    x,
                    y,
                });
            }
        });

        positions.value = newPositions;
    }, [data]);

    const previousActiveState = useSharedValue<ActiveState | null>(null);

    useEffect(() => {
        const react = (current: ActiveState, previous: ActiveState | null) => {
            'worklet';
            const currentIndexData = data[current.activeIndex];

            if (currentIndexData?.disableActivePoint !== true) {
                if (
                    current.activeIndex !== null &&
                    current.activeTouch === true &&
                    currentIndexData !== undefined
                ) {
                    if (externalActivePointSharedValue !== undefined) {
                        externalActivePointSharedValue.value = currentIndexData;
                    }
                    try {
                        if (onPointChange) {
                            scheduleOnRN(onPointChange, currentIndexData);
                        }
                    } catch (_) {
                        // error
                    }
                }

                // active point position
                if (
                    current.activeIndex !== previous?.activeIndex ||
                    currentIndexData?.y !== activePointPositionY?.value
                ) {
                    const point = positions.value[activeIndex.value];
                    const y = point?.y;
                    const x = point?.x;

                    if (x !== undefined && y !== undefined) {
                        if (
                            activePointPositionX.value !== x ||
                            activePointPositionY.value !== y
                        ) {
                            activePointPositionX.value = x;
                            activePointPositionY.value = y;
                        }
                    } else if (
                        activePointPositionX.value !== -radius ||
                        activePointPositionY.value !== -radius
                    ) {
                        activePointPositionX.value = -radius;
                        activePointPositionY.value = -radius;
                    }
                }

                if (current.activeTouch) {
                    activePointSV.value = currentIndexData;
                }
            }

            if (current.activeTouch === true) {
                if (
                    activePointSV.value === undefined &&
                    pointOpacity.value === 1
                ) {
                    pointOpacity.value = 0;
                    lineOpacitySV.value = 0;
                }
                if (
                    activePointSV.value !== undefined &&
                    pointOpacity.value === 0
                ) {
                    pointOpacity.value = 1;
                    lineOpacitySV.value = 1;
                }
            }

            // point and line animations
            if (current.activeTouch !== previous?.activeTouch) {
                // if user touched in a place where there is no point (for example a point with disableActivePoint: true)
                if (
                    activePointSV.value === undefined ||
                    activePointSV.value?.extraData?.isInitialPoint === true
                ) {
                    return;
                }

                if (current.activeTouch === true) {
                    pointOpacity.value = 1;
                    lineOpacitySV.value = verticalLineOpacity;
                } else {
                    pointOpacity.value = 0;
                    lineOpacitySV.value = 0;
                }
            }
        };
        const outputs = [
            activePointSV,
            activePointPositionX,
            activePointPositionY,
            pointOpacity,
            lineOpacitySV,
        ];
        if (externalActivePointSharedValue !== undefined) {
            outputs.push(externalActivePointSharedValue);
        }
        const mapperId = startMapper(
            () => {
                'worklet';
                const current = {
                    activeIndex: activeIndex.value,
                    activeTouch: activeTouch.value,
                };
                react(current, previousActiveState.value);
                previousActiveState.value = current;
            },
            [activeIndex, activeTouch],
            // Reanimated tracks these identities for ordering, not for writing values.
            outputs as Parameters<typeof startMapper>[2],
        );
        return () => {
            stopMapper(mapperId);
        };
    }, [
        activeIndex,
        activeTouch,
        data,
        externalActivePointSharedValue,
        onPointChange,
        positions,
        activePointSV,
        activePointPositionX,
        activePointPositionY,
        pointOpacity,
        lineOpacitySV,
        previousActiveState,
        radius,
        verticalLineOpacity,
    ]);

    const verticalLineActivePosition = useSharedValue(
        activePointPositionX.value || 0,
    );

    const verticalLineStyle = useAnimatedStyle(() => {
        verticalLineActivePosition.value = withTiming(
            activePointPositionX.value || 0,
            {duration: animateTransition ? 200 : 0},
        );

        return {
            left: !isRTL
                ? verticalLineActivePosition.value - verticalLineWidth / 2
                : undefined,
            right: !isRTL
                ? undefined
                : verticalLineActivePosition.value - verticalLineWidth / 2,
            opacity: lineOpacitySV.value,
        };
    });

    const activePointStyle = useAnimatedStyle(() => {
        return {
            left: isRTL
                ? undefined
                : activePointPositionX.value - (radius + borderWidth),
            right: isRTL
                ? activePointPositionX.value - (radius + borderWidth)
                : undefined,
            top: activePointPositionY.value - (radius + borderWidth),
            opacity: pointOpacity.value,
        };
    });

    const dashGap =
        verticalLineDashArray.length >= 2 ? verticalLineDashArray[1] : 0;
    const dashLength =
        verticalLineDashArray.length >= 1 ? verticalLineDashArray[0] : 0;
    const isDashed = dashLength && dashGap && dashLength > 0 && dashGap > 0;

    return (
        <>
            {showVerticalLine && (
                <Animated.View
                    style={[
                        verticalLineStyle,
                        {
                            position: 'absolute',
                            top: 0,
                            width: verticalLineWidth,
                            height,
                            backgroundColor: isDashed
                                ? 'transparent'
                                : (verticalLineColor as string),
                            borderLeftWidth: isDashed ? verticalLineWidth : 0,
                            borderLeftColor: isDashed
                                ? (verticalLineColor as string)
                                : undefined,
                            borderStyle: isDashed ? 'dashed' : undefined,
                        },
                    ]}
                    pointerEvents="none"
                />
            )}
            {showActivePointCircle && (
                <Animated.View
                    style={[
                        activePointStyle,
                        {
                            position: 'absolute',
                            width: (radius + borderWidth) * 2,
                            height: (radius + borderWidth) * 2,
                            borderRadius: radius + borderWidth,
                            backgroundColor: color as string,
                            borderWidth,
                            borderColor: borderColor as string,
                        },
                    ]}
                    pointerEvents="none"
                />
            )}
            {(activePointComponent || activePointComponentWithSharedValue) && (
                <ActivePointComponentWrapper
                    activePointSharedValue={activePointSV}
                    activePointPositionX={activePointPositionX}
                    activePointPositionY={activePointPositionY}
                    pointOpacity={pointOpacity}
                    width={width}
                    activePointComponent={activePointComponent}
                    activePointComponentWithSharedValue={
                        activePointComponentWithSharedValue
                    }
                />
            )}
        </>
    );
};

export default ActivePoint;
