import {
    SharedValue,
    useAnimatedProps,
    useAnimatedStyle,
} from 'react-native-reanimated';
import {PathObject} from '../utils';
import useTransitionAttach from './transitionAttach';
import {AnimationType} from '../types';
import useNoAnimation from './noAnimation';
import useTransitionUniform from './transitionUniform';

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
}) =>
    | {
          lineAnimatedProps: ReturnType<typeof useAnimatedProps>;
          lineWrapperAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
          startAnimation: startAnimationFunction;
          endPointAnimation: endPointAnimationFunction;
      }
    | {
          lineAnimatedProps: undefined;
          lineWrapperAnimatedStyle: undefined;
          startAnimation: undefined;
          endPointAnimation: undefined;
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

    const {
        lineAnimatedProps: transitionUniformLineAnimatedProps,
        lineWrapperAnimatedStyle: transitionUniformLineWrapperAnimatedStyle,
        startAnimation: transitionUniformStartAnimation,
        endPointAnimation: transitionUniformEndPointAnimation,
    } = useTransitionUniform({
        path,
        duration,
        enabled: animationType === 'transitionUniform',
    });

    const {
        lineAnimatedProps: defaultLineAnimatedProps,
        lineWrapperAnimatedStyle: defaultLineWrapperAnimatedStyle,
        startAnimation: defaultStartAnimation,
        endPointAnimation: defaultEndPointAnimation,
    } = useNoAnimation({
        path,
    });

    if (animationType === 'transitionUniform') {
        return {
            lineAnimatedProps: transitionUniformLineAnimatedProps,
            lineWrapperAnimatedStyle: transitionUniformLineWrapperAnimatedStyle,
            startAnimation: transitionUniformStartAnimation,
            endPointAnimation: transitionUniformEndPointAnimation,
        };
    }

    if (animationType === 'transitionAttach') {
        return {
            lineAnimatedProps: transitionAttachLineAnimatedProps,
            lineWrapperAnimatedStyle: transitionAttachLineWrapperAnimatedStyle,
            startAnimation: transitionAttachStartAnimation,
            endPointAnimation: transitionAttachEndPointAnimation,
        };
    }

    return {
        lineAnimatedProps: defaultLineAnimatedProps,
        lineWrapperProps: defaultLineWrapperAnimatedStyle,
        endPointAnimation: defaultEndPointAnimation,
        startAnimation: defaultStartAnimation,
    };
};

export default useChartAnimation;
