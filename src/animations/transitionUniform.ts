/* eslint-disable no-unsafe-optional-chaining */
import {
    useSharedValue,
    withTiming,
    useDerivedValue,
} from 'react-native-reanimated';
import {useEffect} from 'react';

import {
    animationHook,
    endPointAnimationFunction,
    startAnimationFunction,
} from 'src/animations/animations';
import {
    getPathXArrayFromPath,
    getPathYArrayFromPath,
    scaleArraySize,
    svgBezierPath,
} from './utils';

const useTransitionUniform: animationHook = ({path, duration, enabled}) => {
    if (!enabled) {
        return {
            derivedPathString: undefined,
            startAnimation: undefined,
            endPointAnimation: undefined,
        };
    }
    const DURATION = duration || 0;
    const pathYSV = useSharedValue<number[]>([]);
    const pathXSV = useSharedValue<number[]>([]);

    useEffect(() => {
        const newPathXArray = getPathXArrayFromPath(path?.d || '');
        const newPathYArray = getPathYArrayFromPath(path?.d || '');

        if (path?.data.length !== undefined && pathXSV.value.length === 0) {
            // initial setup
            pathXSV.value = newPathXArray;
            pathYSV.value = newPathYArray;
        } else if (
            path?.data.length &&
            pathXSV.value.length < path?.data.length
        ) {
            // scaling up
            pathXSV.value = scaleArraySize(pathXSV.value, path?.data.length);
            pathYSV.value = scaleArraySize(pathYSV.value, path?.data.length);

            pathXSV.value = withTiming(newPathXArray, {
                duration: DURATION / 2,
            });
            pathYSV.value = withTiming(newPathYArray, {
                duration: DURATION / 2,
            });
        } else if (
            path?.data.length &&
            pathXSV.value.length > path?.data.length
        ) {
            // scaling down
            const pathArrayXAfter = scaleArraySize(
                newPathXArray,
                pathXSV.value.length,
            );
            pathXSV.value = withTiming(
                pathArrayXAfter,
                {
                    duration: DURATION / 2,
                },
                finished => {
                    if (finished) {
                        pathXSV.value = newPathXArray;
                        pathYSV.value = newPathYArray;
                    }
                },
            );
            const pathArrayYAfter = scaleArraySize(
                newPathYArray,
                pathYSV.value.length,
            );

            pathYSV.value = withTiming(pathArrayYAfter, {
                duration: DURATION / 2,
            });
        } else {
            // no scaling
            pathXSV.value = withTiming(newPathXArray, {
                duration: DURATION / 2,
            });
            pathYSV.value = withTiming(newPathYArray, {
                duration: DURATION / 2,
            });
        }
    }, [path?.d]);

    const startAnimation: startAnimationFunction = ({
        action,
    }: {
        action: () => void;
    }) => {
        action();
    };

    const derivedPathString = useDerivedValue(() => {
        const points = new Array(pathXSV.value.length)
            .fill(0)
            .map((_value, i) => {
                return {
                    x: pathXSV.value[i],
                    y: pathYSV.value[i],
                };
            });
        return svgBezierPath(points, 0.03, 'complex');
    }, [path?.d]);

    const endPointAnimation: endPointAnimationFunction = ({
        currentYPosition,
        newYPosition,
    }) => {
        currentYPosition.value = withTiming(newYPosition, {
            duration: DURATION / 2,
        });
    };

    return {
        derivedPathString,
        startAnimation,
        endPointAnimation,
    };
};

export default useTransitionUniform;
