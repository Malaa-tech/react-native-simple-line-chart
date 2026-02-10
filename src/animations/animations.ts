import {SharedValue} from 'react-native-reanimated';
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

export type animationHookResult = {
    derivedPathString?: SharedValue<string>;
    startAnimation?: startAnimationFunction;
    endPointAnimation?: endPointAnimationFunction;
};

export type animationHook = (props: {
    path?: PathObject;
    duration?: number;
    enabled?: boolean;
}) => animationHookResult;

const useChartAnimation = ({
    duration,
    animationType,
    path,
}: {
    duration?: number;
    animationType?: AnimationType;
    path?: PathObject;
}): animationHookResult => {
    const transitionAttachResult = useTransitionAttach({
        path,
        duration,
        enabled: animationType === 'transitionAttach',
    });

    const transitionUniformResult = useTransitionUniform({
        path,
        duration,
        enabled: animationType === 'transitionUniform',
    });

    const noAnimResult = useNoAnimation({
        path,
    });

    if (animationType === 'transitionUniform') {
        return transitionUniformResult;
    }

    if (animationType === 'transitionAttach') {
        return transitionAttachResult;
    }

    return noAnimResult;
};

export default useChartAnimation;
