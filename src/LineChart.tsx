import React, { useEffect } from 'react';
import {
  Gesture,
  GestureDetector,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import Svg from 'react-native-svg';
import { AnimatedView } from './AnimatedComponents';
import { EXTRA_CONFIG, LINE_CHART } from './defaults';
import SvgPath from './SvgPath';
import { DataPoint, ExtraConfig, LineChart as LineChartProps } from './types';

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
    activeOffsetX: extraConfig.activeOffsetX || EXTRA_CONFIG.activeOffsetX,
    animationConfig:
      extraConfig.animationConfig || EXTRA_CONFIG.animationConfig,
  };
};
function LineChart({
  height = LINE_CHART.height,
  width = LINE_CHART.width,
  extraConfig,
  backgroundColor = LINE_CHART.backgroundColor,
  onPointFocus = LINE_CHART.onPointFocus,
  onPointLoseFocus = LINE_CHART.onPointLoseFocus,
  activePointSharedValue,
  line1,
  line2 = LINE_CHART.line2,
}: LineChartProps) {
  const svgHeight = height;
  const svgWidth = width;
  const activeTouchX = useSharedValue(0);
  const activeTouch = useSharedValue(false);
  const [isSimultaneousHandlersEnabled, setIsSimultaneousHandlersEnabled] =
    React.useState(true);
  extraConfig = getExtraConfig(extraConfig || {});

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
      activePointSharedValue.value = undefined;
    }
  };

  useEffect(() => {
    if (extraConfig?.initialActivePoint) {
      activeTouch.value = true;
      if (onPointFocus) {
        const point = line1.data[extraConfig?.initialActivePoint as number];
        if (point) {
          onPointFocus(point);
        }
      }
    } else {
      onPointLoseFocusLocal();
    }
  }, [line1.data]);

  const onPanUpdate = (e: PanGestureHandlerEventPayload) => {
    if (isSimultaneousHandlersEnabled === true) {
      setIsSimultaneousHandlersEnabled(false);
    }
    activeTouch.value = true;
    activeTouchX.value = e.x;
  };

  const onPanEnd = () => {
    setIsSimultaneousHandlersEnabled(true);
    if (
      extraConfig?.alwaysShowActivePoint === false ||
      extraConfig?.hideActivePointOnBlur === true
    ) {
      activeTouch.value = false;
    }
    runOnJS(onPointLoseFocusLocal)();
  };

  const panGesture =
    extraConfig.simultaneousHandlers && isSimultaneousHandlersEnabled
      ? Gesture.Pan()
          .simultaneousWithExternalGesture(extraConfig.simultaneousHandlers)
          .activeOffsetX(
            extraConfig?.activeOffsetX || EXTRA_CONFIG.activeOffsetX
          )
          .onBegin(onPanUpdate)
          .onUpdate(onPanUpdate)
          .onEnd(onPanEnd)
          .onFinalize(onPanEnd)
      : Gesture.Pan()
          .activeOffsetX(
            extraConfig?.activeOffsetX || EXTRA_CONFIG.activeOffsetX
          )
          .onBegin(onPanUpdate)
          .onUpdate(onPanUpdate)
          .onEnd(onPanEnd)
          .onFinalize(onPanEnd);

  return (
    <GestureDetector gesture={panGesture}>
      <AnimatedView style={{ backgroundColor }}>
        <Svg width={svgWidth} height={svgHeight} fill="transparent">
          <SvgPath
            line1={line1}
            line2={line2}
            svgHeight={svgHeight}
            svgWidth={svgWidth}
            activeTouch={activeTouch}
            activeTouchX={activeTouchX}
            backgroundColor={backgroundColor}
            extraConfig={extraConfig}
            onPointChange={onPointChange}
          />
        </Svg>
      </AnimatedView>
    </GestureDetector>
  );
}

/** @ignore */
export const MemoizedLineChart = React.memo(
  LineChart,
  (previousProps, nextProps) => {
    if (
      JSON.stringify(previousProps.line1) !== JSON.stringify(nextProps.line1)
    ) {
      return false;
    }

    if (
      JSON.stringify(previousProps.line2?.data) !==
      JSON.stringify(nextProps.line2?.data)
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
  }
);

export default MemoizedLineChart;
