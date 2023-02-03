import React, { useEffect } from 'react';
import { ColorValue } from 'react-native';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Circle, Path } from 'react-native-svg';
import ActivePointComponentWrapper from './ActivePointComponentWrapper';
import {
  ActivePointComponent,
  DataPoint,
} from './typings/react-native-simple-line-chart';
import { PathObject } from './utils';

const AnimatedCircle = Animated.createAnimatedComponent(Circle) as any;
const AnimatedPath = Animated.createAnimatedComponent(Path) as any;

const ActivePoint = ({
  data,
  activeTouch,
  width,
  height,
  rtl,
  activePointComponent,
  activeIndex,
  path,
  passSharedValueToActivePointComponent = false,
  onPointChange,
  color,
  borderColor,
  radius,
  showVerticalLine,
  verticalLineColor,
  verticalLineOpacity,
  verticalLineWidth,
  verticalLineDashArray,
}: {
  data: DataPoint[];
  activeTouch: SharedValue<boolean>;
  width: number;
  height: number;
  rtl: boolean;
  activePointComponent?: ActivePointComponent;
  activeIndex: SharedValue<number>;
  path: PathObject;
  passSharedValueToActivePointComponent?: boolean;
  onPointChange?: (point?: DataPoint) => void;
  color: ColorValue | ColorValue[];
  borderColor: ColorValue;
  radius: number;
  showVerticalLine: boolean;
  verticalLineColor: ColorValue;
  verticalLineOpacity: number;
  verticalLineWidth: number;
  verticalLineDashArray: number[];
}) => {
  const positions = useSharedValue<{ x: number; y: number }[]>([]);
  const activePointSV = useSharedValue<DataPoint | undefined>({
    x: 0,
    y: 0,
    extraData: {
      date: new Date(),
    },
  });
  const pointOpacity = useSharedValue(0);
  const lineOpacitySV = useSharedValue(0);

  useEffect(() => {
    const newPositions: { x: number; y: number }[] = [];
    data.forEach((item) => {
      const y = path.y(item.y);
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

  const activePointPosition = useDerivedValue(() => {
    const y = positions.value[activeIndex.value]?.y;
    const x = positions.value[activeIndex.value]?.x;

    if (x !== undefined && y !== undefined) {
      return {
        x,
        y,
      };
    }

    return {
      x: 0,
      y: 0,
    };
  }, [activeIndex]);

  useAnimatedReaction(
    () => {
      return activeIndex.value;
    },
    (currentActiveIndex, previousActiveIndex) => {
      if (previousActiveIndex !== null && activeTouch.value === true) {
        try {
          activePointSV.value = data[currentActiveIndex];
        } catch (e) {
          // console.log(error);
        }
      }
    },
    [activeIndex, data, activeTouch]
  );

  useAnimatedReaction(
    () => {
      return { activeIndex: activeIndex.value, activeTouch: activeTouch.value };
    },
    (current) => {
      if (current.activeIndex !== null && current.activeTouch === true) {
        try {
          if (onPointChange) {
            runOnJS(onPointChange)(data[current.activeIndex]);
          }
        } catch (e) {
          // console.log(error);
        }
      }
    },
    [activeIndex, data, activeTouch]
  );

  useAnimatedReaction(
    () => {
      return activeTouch.value;
    },
    (result) => {
      if (result) {
        pointOpacity.value = withTiming(1, { duration: 200 });
        lineOpacitySV.value = withTiming(verticalLineOpacity, {
          duration: 200,
        });
      } else {
        pointOpacity.value = withTiming(0, { duration: 200 });
        lineOpacitySV.value = withTiming(0, { duration: 200 });
      }
    },
    [activeTouch]
  );

  const activePointProps = useAnimatedProps(() => {
    return {
      cx: activePointPosition.value.x,
      cy: activePointPosition.value.y,
      opacity: pointOpacity.value,
    };
  });

  const horizontalLineProps = useAnimatedProps(() => {
    return {
      d: `M ${activePointPosition.value.x} ${height} v ${-height}`,
      opacity: lineOpacitySV.value,
    };
  });

  return (
    <>
      {showVerticalLine && (
        <AnimatedPath
          stroke={verticalLineColor}
          strokeWidth={verticalLineWidth}
          animatedProps={horizontalLineProps}
          strokeLinejoin={'round'}
          strokeDasharray={verticalLineDashArray}
        />
      )}
      {activePointComponent && (
        <ActivePointComponentWrapper
          activePointSharedValue={activePointSV}
          activePointPosition={activePointPosition}
          rtl={rtl}
          pointOpacity={pointOpacity}
          width={width}
          activePointComponent={activePointComponent}
          passSharedValueToActivePointComponent={
            passSharedValueToActivePointComponent
          }
        />
      )}
      <AnimatedCircle
        fill={borderColor}
        animatedProps={activePointProps}
        r={radius * 1.3}
      />
      <AnimatedCircle
        fill={color}
        animatedProps={activePointProps}
        r={radius}
      />
    </>
  );
};

export default ActivePoint;
