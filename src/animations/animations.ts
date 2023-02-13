import {
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { PathObject } from '../utils';
import useTransitionAttach from './transitionAttach';
import { AnimationType } from '../types';

export type endPointAnimationFunction = ({
  currentYPosition,
  newYPosition,
}: {
  currentYPosition: SharedValue<number>;
  newYPosition: number;
}) => void;

const useChartAnimation = ({
  duration,
  animationType,
  path,
}: {
  duration?: number;
  animationType?: AnimationType;
  path?: PathObject;
}) => {
  if (animationType === 'transitionAttach') {
    const {
      lineAnimatedProps: transitionAttachLineAnimatedProps,
      lineWrapperAnimatedStyle: transitionAttachLineWrapperAnimatedStyle,
      startAnimation: transitionAttachStartAnimation,
      endPointAnimation: transitionAttachEndPointAnimation,
    } = useTransitionAttach({
      path,
      duration,
    });
    return {
      lineAnimatedProps: transitionAttachLineAnimatedProps,
      lineWrapperAnimatedStyle: transitionAttachLineWrapperAnimatedStyle,
      startAnimation: transitionAttachStartAnimation,
      endPointAnimation: transitionAttachEndPointAnimation,
    };
  }

  const defaultEndPointAnimation: endPointAnimationFunction = ({
    currentYPosition,
    newYPosition,
  }) => {
    currentYPosition.value = newYPosition;
  };

  const defaultLineWrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1,
    };
  });

  const defaultLineAnimatedProps = useAnimatedProps(() => {
    return {
      d: path?.d || '',
    };
  });

  return {
    lineAnimatedProps: defaultLineAnimatedProps as Required<{ d: string }>,
    lineWrapperProps: defaultLineWrapperAnimatedStyle,
    endPointAnimation: defaultEndPointAnimation,
    startAnimation: ({ action }: { action: () => void }) => {
      action();
    },
  };
};

export default useChartAnimation;
