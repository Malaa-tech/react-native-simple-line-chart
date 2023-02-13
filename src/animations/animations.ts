import { SharedValue } from 'react-native-reanimated';
import { PathObject } from '../utils';
import useTransitionAttach from './transitionAttach';
import { AnimationType } from '../types';
import useNoAnimation from './noAnimation';

export type endPointAnimationFunction = ({
  currentYPosition,
  newYPosition,
}: {
  currentYPosition: SharedValue<number>;
  newYPosition: number;
}) => void;

export type startAnimationFunction = ({
  action,
}: {
  action: () => void;
}) => void;

export type animationHook = (props: {
  path?: PathObject;
  duration?: number;
  enabled?: boolean;
}) => {
  lineAnimatedProps: any;
  lineWrapperAnimatedStyle: any;
  startAnimation: startAnimationFunction;
  endPointAnimation: endPointAnimationFunction;
};

const useChartAnimation = ({
  duration,
  animationType,
  path,
}: {
  duration?: number;
  animationType?: AnimationType;
  path?: PathObject;
}) => {
  const {
    lineAnimatedProps: transitionAttachLineAnimatedProps,
    lineWrapperAnimatedStyle: transitionAttachLineWrapperAnimatedStyle,
    startAnimation: transitionAttachStartAnimation,
    endPointAnimation: transitionAttachEndPointAnimation,
  } = useTransitionAttach({
    path,
    duration,
    enabled: animationType === 'transitionAttach',
  });

  if (animationType === 'transitionAttach') {
    return {
      lineAnimatedProps: transitionAttachLineAnimatedProps,
      lineWrapperAnimatedStyle: transitionAttachLineWrapperAnimatedStyle,
      startAnimation: transitionAttachStartAnimation,
      endPointAnimation: transitionAttachEndPointAnimation,
    };
  }

  const {
    lineAnimatedProps: defaultLineAnimatedProps,
    lineWrapperAnimatedStyle: defaultLineWrapperAnimatedStyle,
    startAnimation: defaultStartAnimation,
    endPointAnimation: defaultEndPointAnimation,
  } = useNoAnimation({
    path,
  });

  return {
    lineAnimatedProps: defaultLineAnimatedProps,
    lineWrapperProps: defaultLineWrapperAnimatedStyle,
    endPointAnimation: defaultEndPointAnimation,
    startAnimation: defaultStartAnimation,
  };
};

export default useChartAnimation;
