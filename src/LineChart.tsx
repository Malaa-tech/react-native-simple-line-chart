import React, { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useSharedValue,
} from 'react-native-reanimated';
import Svg from 'react-native-svg';
import SvgPath from './SvgPath';
import { DataPoint, ExtraConfig, Line } from './types';

const AnimatedView = Animated.createAnimatedComponent(View as any) as any;

function LineChart({
  height = 200,
  width = Dimensions.get('screen').width,
  extraConfig = {
    alwaysShowActivePoint: false,
    hideActivePointOnBlur: true,
    alwaysStartFromZero: false,
    initialActivePoint: 0,
    fadeStart: false,
    rtl: false,
    simultaneousHandlers: undefined,
    endSpacing: 20,
  },
  backgroundColor = undefined,
  onPointFocus = () => false,
  onPointLoseFocus = () => false,
  activePointSharedValue,
  line1,
  line2,
}: {
  extraConfig?: ExtraConfig;
  height?: number;
  width?: number;
  backgroundColor?: string;
  onPointFocus?: (activePoint: DataPoint) => void;
  onPointLoseFocus?: () => void;
  activePointSharedValue?: SharedValue<DataPoint | undefined>; // used to update the active point from the animation thread
  line1: Line;
  line2?: Line;
}) {
  const svgHeight = height;
  const svgWidth = width;
  const activeDataPoint = useSharedValue<DataPoint | undefined>(undefined);
  const activeTouchX = useSharedValue(0);
  const activeTouch = useSharedValue(false);

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

  // useAnimatedReaction(
  //   () => {
  //     return {
  //       activeDataPoint: activeDataPoint.value,
  //       activeTouch: activeTouch.value,
  //     };
  //   },
  //   (current, previous) => {
  //     if (current.activeDataPoint) {
  //       if (onPointFocus) {
  //         runOnJS(onPointFocus)(current.activeDataPoint);
  //       }
  //     }
  //     if (activePointSharedValue) {
  //       activePointSharedValue.value = current.activeDataPoint;
  //     }
  //   },
  //   [activeDataPoint, activeTouch]
  // );

  useEffect(() => {
    if (extraConfig.initialActivePoint) {
      activeTouch.value = true;
      if (onPointFocus) {
        const point = line1.data[extraConfig.initialActivePoint];
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
    // if (activeDataPoint.value !== undefined) {
    //   if (onPointFocus) {
    //     runOnJS(onPointFocus)(activeDataPoint.value);
    //   }
    //   if (
    //     activePointSharedValue &&
    //     activePointSharedValue.value !== activeDataPoint.value
    //   ) {
    //     activePointSharedValue.value = activeDataPoint.value;
    //   }
    // }
  };

  const onPointLoseFocusLocal = () => {
    if (onPointLoseFocus) {
      setTimeout(() => {
        onPointLoseFocus();
      }, 100);
    }
    if (activePointSharedValue && !extraConfig.alwaysShowActivePoint) {
      setTimeout(() => {
        activePointSharedValue.value = undefined;
      }, 30);
    }
  };

  const onPanEnd = () => {
    if (
      extraConfig.alwaysShowActivePoint === false ||
      extraConfig.hideActivePointOnBlur === true
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
            activeDataPoint={activeDataPoint}
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
