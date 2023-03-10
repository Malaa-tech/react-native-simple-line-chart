import React, { useEffect } from 'react';
import { ColorValue } from 'react-native';
import {
  runOnJS,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ActivePointComponentWrapper from './ActivePointComponentWrapper';
import { AnimatedCircle, AnimatedPath } from './AnimatedComponents';
import {
  ActivePointComponent,
  ActivePointComponentSharedValue,
  DataPoint,
} from './types';
import { PathObject, useForceReRender } from './utils';

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
  activePointComponent?: ActivePointComponent;
  activePointComponentWithSharedValue?: ActivePointComponentSharedValue;
  activeIndex: SharedValue<number>;
  path: PathObject;
  onPointChange?: (point?: DataPoint) => void;
  color: ColorValue;
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
  const forceRerender = useForceReRender();

  // forcing a re-render after x ms to fix sharedValues not causing a rerender.
  useEffect(() => {
    setTimeout(() => {
      forceRerender();
    }, 200);
  }, []);

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
          strokeLinejoin="round"
          strokeDasharray={verticalLineDashArray}
        />
      )}
      {(activePointComponent || activePointComponentWithSharedValue) && (
        <ActivePointComponentWrapper
          activePointSharedValue={activePointSV}
          activePointPosition={activePointPosition}
          pointOpacity={pointOpacity}
          width={width}
          activePointComponent={activePointComponent}
          activePointComponentWithSharedValue={
            activePointComponentWithSharedValue
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
