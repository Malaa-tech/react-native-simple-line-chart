import React, { useEffect } from 'react';
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
import { ActivePointComponent, ActivePointConfig, DataPoint } from './types';
import { PathObject } from './utils';

const AnimatedCircle = Animated.createAnimatedComponent(Circle) as any;
const AnimatedPath = Animated.createAnimatedComponent(Path) as any;

const ActivePoint = ({
  data,
  activeTouch,
  width,
  height,
  rtl,
  activePoint,
  activePointComponent,
  activeIndex,
  path,
  passSharedValueToActivePointComponent = false,
  onPointChange,
}: {
  data: DataPoint[];
  activeTouch: SharedValue<boolean>;
  width: number;
  height: number;
  rtl: boolean;
  activePoint: ActivePointConfig;
  activePointComponent?: ActivePointComponent;
  activeIndex: SharedValue<number>;
  path: PathObject;
  passSharedValueToActivePointComponent?: boolean;
  onPointChange?: (point?: DataPoint) => void;
}) => {
  const positions = useSharedValue<{ x: number; y: number }[]>([]);
  const activePointSV = useSharedValue<DataPoint | undefined>({
    value: 0,
    extraData: {
      date: new Date(),
    },
  });
  const pointOpacity = useSharedValue(0);
  const lineOpacity = useSharedValue(0);

  useEffect(() => {
    const newPositions: { x: number; y: number }[] = [];
    data.forEach((item) => {
      const y = path.y(item.value);
      const x = path.x(item.extraData.date);

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
          if (onPointChange) {
            runOnJS(onPointChange)(data[currentActiveIndex]);
          }
        } catch (error) {
          console.log(error);
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
        lineOpacity.value = withTiming(activePoint.lineOpacity, {
          duration: 200,
        });
      } else {
        pointOpacity.value = withTiming(0, { duration: 200 });
        lineOpacity.value = withTiming(0, { duration: 200 });
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
      opacity: lineOpacity.value,
    };
  });

  return (
    <>
      {activePoint.line && (
        <AnimatedPath
          stroke={activePoint.lineColor}
          strokeWidth={activePoint.lineWidth}
          animatedProps={horizontalLineProps}
          strokeLinejoin={'round'}
          strokeDasharray={activePoint.lineDashArray}
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
        fill={activePoint.borderColor}
        animatedProps={activePointProps}
        r={activePoint.radius * 1.3}
      />
      <AnimatedCircle
        fill={activePoint.color}
        animatedProps={activePointProps}
        r={activePoint.radius}
      />
    </>
  );
};

export default ActivePoint;
