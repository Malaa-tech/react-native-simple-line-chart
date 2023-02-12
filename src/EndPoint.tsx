import React, { useEffect } from 'react';
import { ColorValue } from 'react-native';
import {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Circle } from 'react-native-svg';
import { AnimatedCircle, AnimatedG } from './AnimatedComponents';
import { AnimationConfig } from './types';

function EndPoint({
  x,
  y,
  radius,
  color,
  animated,
  lineAnimationConfig,
}: {
  x: number;
  y: number;
  radius: number;
  color: ColorValue;
  animated: boolean;
  lineAnimationConfig?: AnimationConfig;
}) {
  const radiusSV = useSharedValue(radius * 1.7);
  const ySV = useSharedValue(y);
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

  useEffect(() => {
    if (lineAnimationConfig && lineAnimationConfig.duration) {
      ySV.value = withTiming(y, { duration: lineAnimationConfig.duration / 2 });
    } else {
      ySV.value = y;
    }
  }, [y]);

  const pointProps = useAnimatedProps(() => {
    return {
      r: radiusSV.value,
    };
  });

  const wrapperProps = useAnimatedProps(() => {
    return {
      y: ySV.value,
    };
  });

  return (
    <AnimatedG animatedProps={wrapperProps}>
      <Circle cx={x} r={radius} fill={color} />
      {animated && (
        <AnimatedCircle
          cx={x}
          fill={color}
          opacity={0.5}
          animatedProps={pointProps}
        />
      )}
    </AnimatedG>
  );
}

export default EndPoint;
