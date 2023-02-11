import React, { useEffect } from 'react';
import { ColorValue } from 'react-native';
import {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Circle, G } from 'react-native-svg';
import { AnimatedCircle, AnimatedG } from './AnimatedComponents';

function EndPoint({
  x,
  y,
  radius,
  color,
  animated,
  endPointAnimatedStyle,
}: {
  x: number;
  y: number;
  radius: number;
  color: ColorValue;
  animated: boolean;
  endPointAnimatedStyle: any;
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
    <AnimatedG
      style={{
        ...endPointAnimatedStyle,
      }}
    >
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
    </AnimatedG>
  );
}

export default EndPoint;
