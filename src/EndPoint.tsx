import React, {useEffect} from 'react';
import {ColorValue} from 'react-native';
import {
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import {AnimatedCircle} from './AnimatedComponents';
import {endPointAnimationFunction} from './animations/animations';

function EndPoint({
    x,
    y,
    radius,
    color,
    animated,
    endPointAnimation,
}: {
    x: number;
    y: number;
    radius: number;
    color: ColorValue;
    animated: boolean;
    endPointAnimation: endPointAnimationFunction;
}) {
    const radiusSV = useSharedValue(radius * 1.7);
    const ySV = useSharedValue(y);
    const animationDuration = 1000;

    useEffect(() => {
        if (animated) {
            radiusSV.value = withRepeat(
                withTiming(radius, {duration: animationDuration}),
                -1,
                true,
            );
        }
    }, []);

    useEffect(() => {
        endPointAnimation({
            currentYPosition: ySV,
            newYPosition: y,
        });
    }, [y]);

    const outerCircleAnimatedProps = useAnimatedProps(() => {
        return {
            r: radiusSV.value,
            cy: ySV.value,
        };
    });
    const innerCircleAnimatedProps = useAnimatedProps(() => {
        return {
            cy: ySV.value,
        };
    });

    return (
        <>
            <AnimatedCircle
                cx={x}
                r={radius}
                fill={color}
                animatedProps={innerCircleAnimatedProps}
            />
            {animated && (
                <AnimatedCircle
                    cx={x}
                    fill={color}
                    opacity={0.5}
                    animatedProps={outerCircleAnimatedProps}
                />
            )}
        </>
    );
}

export default EndPoint;
