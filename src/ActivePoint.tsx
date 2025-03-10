import React, {useEffect} from 'react';
import {ColorValue} from 'react-native';
import {
    runOnJS,
    SharedValue,
    useAnimatedProps,
    useAnimatedReaction,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import ActivePointComponentWrapper from './ActivePointComponentWrapper';
import {AnimatedCircle, AnimatedPath} from './AnimatedComponents';
import {
    ActivePointComponent,
    ActivePointComponentSharedValue,
    DataPoint,
} from './types';
import {PathObject, useForceReRender} from './utils';

type PositionSharedValue = {x: number; y: number; y2?: number};

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
    onPointChange?: (point?: DataPoint) => void;
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

    useAnimatedReaction(
        () => {
            return {
                activeIndex: activeIndex.value,
                activeTouch: activeTouch.value,
            };
        },
        (current, previous) => {
            const currentIndexData = data[current.activeIndex];

            if (currentIndexData?.disableActivePoint !== true) {
                if (
                    current.activeIndex !== null &&
                    current.activeTouch === true
                ) {
                    try {
                        if (onPointChange) {
                            runOnJS(onPointChange)(currentIndexData);
                        }
                    } catch (e) {
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
                        activePointPositionX.value = withTiming(x, {
                            duration: animateTransition ? 200 : 0,
                        });
                        activePointPositionY.value = withTiming(y, {
                            duration: animateTransition ? 200 : 0,
                        });
                    } else {
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
        },
        [activeIndex, data, activeTouch],
    );

    const activePointProps = useAnimatedProps(() => {
        return {
            cx: activePointPositionX.value,
            cy: activePointPositionY.value,
            opacity: pointOpacity.value,
        };
    });

    const verticalLineActivePosition = useSharedValue(
        activePointPositionX.value || 0,
    );
    const horizontalLineProps = useAnimatedProps(() => {
        verticalLineActivePosition.value = withTiming(
            activePointPositionX.value || 0,
            {duration: animateTransition ? 200 : 0},
        );

        return {
            d: `M ${verticalLineActivePosition.value} ${height} v ${-height}`,
            opacity: lineOpacitySV.value,
        };
    });

    return (
        <>
            {showVerticalLine && (
                <AnimatedPath
                    stroke={verticalLineColor}
                    strokeWidth={verticalLineWidth}
                    strokeLinejoin="round"
                    strokeDasharray={verticalLineDashArray}
                    animatedProps={horizontalLineProps}
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
            {showActivePointCircle && (
                <>
                    <AnimatedCircle
                        fill={borderColor}
                        animatedProps={activePointProps}
                        r={radius + borderWidth}
                    />
                    <AnimatedCircle
                        fill={color}
                        animatedProps={activePointProps}
                        r={radius}
                    />
                </>
            )}
        </>
    );
};

export default ActivePoint;
