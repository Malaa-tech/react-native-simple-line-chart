/* eslint-disable no-unsafe-optional-chaining */
import { useAnimatedStyle, useAnimatedProps } from 'react-native-reanimated';
import {
  animationHook,
  endPointAnimationFunction,
  startAnimationFunction,
} from 'src/animations/animations';

const useNoAnimation: animationHook = ({ path }) => {
  const endPointAnimation: endPointAnimationFunction = ({
    currentYPosition,
    newYPosition,
  }) => {
    currentYPosition.value = newYPosition;
  };

  const lineWrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1,
    };
  });

  const lineAnimatedProps = useAnimatedProps(() => {
    return {
      d: path?.d || '',
    };
  });

  const startAnimation: startAnimationFunction = ({
    action,
  }: {
    action: () => void;
  }) => {
    action();
  };

  return {
    lineWrapperAnimatedStyle,
    lineAnimatedProps,
    startAnimation,
    endPointAnimation,
  };
};

export default useNoAnimation;
