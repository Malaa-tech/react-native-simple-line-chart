import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue } from 'react-native-reanimated';
import Svg from 'react-native-svg';
import { EXTRA_CONFIG, LINE_CHART } from './defaults';
import SvgPath from './SvgPath';
import { DataPoint, ExtraConfig, LineChartProps } from './types';

const AnimatedView = Animated.createAnimatedComponent(View as any) as any;

const getExtraConfig = (extraConfig: ExtraConfig): ExtraConfig => {
  return {
    alwaysShowActivePoint:
      extraConfig.alwaysShowActivePoint || EXTRA_CONFIG.alwaysShowActivePoint,
    hideActivePointOnBlur:
      extraConfig.hideActivePointOnBlur || EXTRA_CONFIG.hideActivePointOnBlur,
    alwaysStartFromZero:
      extraConfig.alwaysStartFromZero || EXTRA_CONFIG.alwaysStartFromZero,
    initialActivePoint:
      extraConfig.initialActivePoint || EXTRA_CONFIG.initialActivePoint,
    simultaneousHandlers:
      extraConfig.simultaneousHandlers || EXTRA_CONFIG.simultaneousHandlers,
    endSpacing: extraConfig.endSpacing || EXTRA_CONFIG.endSpacing,
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

  const onPanUpdate = (e: any) => {
    activeTouch.value = true;
    activeTouchX.value = e.x;
  };

  const onPanEnd = () => {
    if (
      extraConfig?.alwaysShowActivePoint === false ||
      extraConfig?.hideActivePointOnBlur === true
    ) {
      activeTouch.value = false;
    }
    runOnJS(onPointLoseFocusLocal)();
  };

  const panGesture = extraConfig.simultaneousHandlers
    ? Gesture.Pan()
        .simultaneousWithExternalGesture(extraConfig.simultaneousHandlers)
        .onBegin(onPanUpdate)
        .onUpdate(onPanUpdate)
        .onEnd(onPanEnd)
        .onFinalize(onPanEnd)
    : Gesture.Pan()
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
