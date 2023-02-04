import React, { useEffect } from 'react';
import { ColorValue } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function EndPoint({
  x,
  y,
  radius,
  color,
  animated,
}: {
  x: number;
  y: number;
  radius: number;
  color: ColorValue;
  animated: boolean;
}) {
  const radiusSV = useSharedValue(radius * 1.7);
  const animationDuration = 1000;

  useEffect(() => {
    if (animated) {
      radiusSV.value = withRepeat(
        withTiming(radius, { duration: animationDuration }),
        -1,
        true
      );
    }
  }, []);

  const pointProps = useAnimatedProps(() => {
    return {
      r: radiusSV.value,
    };
  });

  return (
    <>
      <Circle cx={x} cy={y} r={radius} fill={color} />
      {animated && (
        <AnimatedCircle
          cx={x}
          cy={y}
          fill={color}
          opacity={0.5}
          animatedProps={pointProps}
        />
      )}
    </>
  );
}

export default EndPoint;
