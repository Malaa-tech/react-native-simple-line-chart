import React, {useEffect} from 'react';
import {ColorValue, I18nManager} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
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

    const innerCircleStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute' as const,
            left: !I18nManager.isRTL ? x - radius : undefined,
            right: !I18nManager.isRTL ? undefined : x - radius,
            top: ySV.value - radius,
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            backgroundColor: color as string,
        };
    });

    return (
        <Animated.View
            style={innerCircleStyle}
            pointerEvents="none"
        />
    );
}

export default EndPoint;
