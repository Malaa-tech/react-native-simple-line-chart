import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {
    Gesture,
    GestureDetector,
    PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {runOnJS, useSharedValue} from 'react-native-reanimated';
import Svg from 'react-native-svg';
import {AnimatedView} from './AnimatedComponents';
import {EXTRA_CONFIG, LINE_CHART} from './defaults';
import SvgPath from './SvgPath';
import {
    DataPoint,
    ExtraConfig,
    LineChart as LineChartProps,
    LineChartRef,
} from './types';

const getExtraConfig = (extraConfig: ExtraConfig): ExtraConfig => {
    return {
        alwaysShowActivePoint:
            extraConfig.alwaysShowActivePoint !== undefined
                ? extraConfig.alwaysShowActivePoint
                : EXTRA_CONFIG.alwaysShowActivePoint,
        hideActivePointOnBlur:
            extraConfig.hideActivePointOnBlur !== undefined
                ? extraConfig.hideActivePointOnBlur
                : EXTRA_CONFIG.hideActivePointOnBlur,
        alwaysStartYAxisFromZero:
            extraConfig.alwaysStartYAxisFromZero !== undefined
                ? extraConfig.alwaysStartYAxisFromZero
                : EXTRA_CONFIG.alwaysStartYAxisFromZero,
        initialActivePoint:
            extraConfig.initialActivePoint !== undefined
                ? extraConfig.initialActivePoint
                : EXTRA_CONFIG.initialActivePoint,
        simultaneousHandlers:
            extraConfig.simultaneousHandlers !== undefined
                ? extraConfig.simultaneousHandlers
                : EXTRA_CONFIG.simultaneousHandlers,
        endSpacing:
            extraConfig.endSpacing !== undefined
                ? extraConfig.endSpacing
                : EXTRA_CONFIG.endSpacing,
        calculateChartYAxisMinMax:
            extraConfig.calculateChartYAxisMinMax ||
            EXTRA_CONFIG.calculateChartYAxisMinMax,
        calculateChartXAxisMinMax:
            extraConfig.calculateChartXAxisMinMax ||
            EXTRA_CONFIG.calculateChartXAxisMinMax,
        activeOffsetX: extraConfig.activeOffsetX || EXTRA_CONFIG.activeOffsetX,
        animationConfig:
            extraConfig.animationConfig || EXTRA_CONFIG.animationConfig,
    };
};
const LineChart = forwardRef<LineChartRef, LineChartProps>(
    (
        {
            height = LINE_CHART.height,
            width = LINE_CHART.width,
            extraConfig,
            backgroundColor = LINE_CHART.backgroundColor,
            onPointFocus = LINE_CHART.onPointFocus,
            onPointLoseFocus = LINE_CHART.onPointLoseFocus,
            activeLineIndex = LINE_CHART.activeLineIndex,
            activePointSharedValue,
            lines = [],
        },
        ref,
    ) => {
        const svgHeight = height;
        const svgWidth = width;
        const activeTouchX = useSharedValue(0);
        const activeTouch = useSharedValue(false);
        const [
            isSimultaneousHandlersEnabled,
            setIsSimultaneousHandlersEnabled,
        ] = React.useState(true);
        extraConfig = getExtraConfig(extraConfig || {});
        const {alwaysShowActivePoint, hideActivePointOnBlur} = extraConfig;

        const onPointChange = (point?: DataPoint) => {
            if (point) {
                if (onPointFocus) {
                    runOnJS(onPointFocus)(point);
                }
                if (activePointSharedValue) {
                    activePointSharedValue.value = point;
                }
            }
        };

        const onPointLoseFocusLocal = () => {
            if (onPointLoseFocus) {
                onPointLoseFocus();
            }
            if (activePointSharedValue && !extraConfig?.alwaysShowActivePoint) {
                setTimeout(() => {
                    activePointSharedValue.value = undefined;
                }, 10);
            }
        };

        useEffect(() => {
            if (extraConfig?.initialActivePoint) {
                activeTouch.value = true;
                if (onPointFocus) {
                    const point = lines[activeLineIndex]?.data
                        ? lines[activeLineIndex]?.data[
                              extraConfig?.initialActivePoint as number
                          ]
                        : undefined;
                    if (point) {
                        onPointFocus(point);
                    }
                }
            } else {
                onPointLoseFocusLocal();
            }
        }, [lines[activeLineIndex]?.data]);

        const onPanUpdate = (e: PanGestureHandlerEventPayload) => {
            'worklet';

            if (isSimultaneousHandlersEnabled === true) {
                runOnJS(setIsSimultaneousHandlersEnabled)(false);
            }
            activeTouch.value = true;
            activeTouchX.value = e.x;
        };

        const onPanEnd = () => {
            'worklet';

            runOnJS(setIsSimultaneousHandlersEnabled)(true);
            if (
                alwaysShowActivePoint === false ||
                hideActivePointOnBlur === true
            ) {
                activeTouch.value = false;
            }
            runOnJS(onPointLoseFocusLocal)();
        };

        const panGesture =
            extraConfig.simultaneousHandlers && isSimultaneousHandlersEnabled
                ? Gesture.Pan()
                      .simultaneousWithExternalGesture(
                          extraConfig.simultaneousHandlers,
                      )
                      .activeOffsetX(
                          extraConfig?.activeOffsetX ||
                              EXTRA_CONFIG.activeOffsetX,
                      )
                      .onBegin(onPanUpdate)
                      .onUpdate(onPanUpdate)
                      .onFinalize(onPanEnd)
                : Gesture.Pan()
                      .activeOffsetX(
                          extraConfig?.activeOffsetX ||
                              EXTRA_CONFIG.activeOffsetX,
                      )
                      .onBegin(onPanUpdate)
                      .onUpdate(onPanUpdate)
                      .onFinalize(onPanEnd);

        useImperativeHandle(ref, () => ({
            setActiveIndex(index) {
                const activeLine = lines[activeLineIndex];
                if (
                    index !== undefined &&
                    activeLine &&
                    activeLine.data &&
                    Array.isArray(activeLine.data)
                ) {
                    activeTouch.value = true;
                    activeTouchX.value =
                        index * (width / (activeLine.data.length - 1));
                } else {
                    activeTouch.value = false;
                }
            },
        }));

        return (
            <GestureDetector gesture={panGesture}>
                <AnimatedView style={{backgroundColor}}>
                    <Svg
                        width={svgWidth}
                        height={svgHeight}
                        fill="transparent"
                    >
                        <SvgPath
                            lines={lines}
                            svgHeight={svgHeight}
                            svgWidth={svgWidth}
                            activeTouch={activeTouch}
                            activeTouchX={activeTouchX}
                            extraConfig={extraConfig}
                            initialActivePoint={extraConfig?.initialActivePoint}
                            endSpacing={
                                extraConfig?.endSpacing === undefined
                                    ? EXTRA_CONFIG.endSpacing
                                    : extraConfig?.endSpacing
                            }
                            onPointChange={onPointChange}
                            activeLineIndex={activeLineIndex}
                        />
                    </Svg>
                </AnimatedView>
            </GestureDetector>
        );
    },
);

/** @ignore */
export const MemoizedLineChart = React.memo(
    LineChart,
    (previousProps, nextProps) => {
        // Check if activeLineIndex changed
        if (previousProps.activeLineIndex !== nextProps.activeLineIndex) {
            return false;
        }

        // Check the active line data
        if (
            JSON.stringify(previousProps.lines[previousProps.activeLineIndex || 0]) !==
            JSON.stringify(nextProps.lines[nextProps.activeLineIndex || 0])
        ) {
            return false;
        }

        if (
            JSON.stringify(previousProps.lines[1]?.data) !==
            JSON.stringify(nextProps.lines[1]?.data)
        ) {
            return false;
        }

        if (
            JSON.stringify(previousProps.backgroundColor) !==
            JSON.stringify(nextProps.backgroundColor)
        ) {
            return false;
        }

        return true;
    },
);

export default MemoizedLineChart;
