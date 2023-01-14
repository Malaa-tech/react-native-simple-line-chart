import React, { useEffect } from 'react';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Circle } from 'react-native-svg';
import { EndPointConfig } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const EndPoint = ({
  x,
  y,
  endPoint,
}: {
  x: number;
  y: number;
  endPoint: EndPointConfig;
}) => {
  const radius = useSharedValue(endPoint.radius * 1.7);
  const animationDuration = 1000;

  useEffect(() => {
    if (endPoint.animated) {
      radius.value = withRepeat(
        withTiming(endPoint.radius, { duration: animationDuration }),
        -1,
        true
      );
    }
  }, [endPoint.animated, endPoint.radius]);

  const pointProps = useAnimatedProps(() => {
    return {
      r: radius.value,
    };
  });

  return (
    <>
      <Circle cx={x} cy={y} r={endPoint.radius} fill={endPoint.color} />
      <AnimatedCircle
        cx={x}
        cy={y}
        fill={endPoint.color}
        opacity={0.5}
        animatedProps={pointProps}
      />
    </>
  );
};

export default EndPoint;
