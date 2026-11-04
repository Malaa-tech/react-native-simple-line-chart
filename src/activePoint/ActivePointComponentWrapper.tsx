import React, {useState} from 'react';
import {I18nManager, View} from 'react-native';
import Animated, {
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {useForceReRender} from '../utils';

import {
    ActivePointComponent,
    ActivePointComponentSharedValue,
    DataPoint,
    DataPointSharedValue,
} from '../types';
import {scheduleOnRN} from 'react-native-worklets';

const ActivePointComponentWrapper = ({
    activePointPositionX,
    pointOpacity,
    width,
    activePointSharedValue,
    activePointComponentWithSharedValue,
    activePointComponent,
}: {
    activePointPositionX: SharedValue<number>;
    activePointPositionY: SharedValue<number>;
    pointOpacity: SharedValue<number>;
    width: number;
    activePointSharedValue: DataPointSharedValue;
    activePointComponent?: ActivePointComponent;
    activePointComponentWithSharedValue?: ActivePointComponentSharedValue;
}) => {
    const isRTL = I18nManager.isRTL;
    const SPACE_BETWEEN_COMPONENT_AND_LINE = 15;
    const SIDE_SWITCH_HYSTERESIS = 24;
    const activeComponentWidthSV = useSharedValue<number>(0);
    const isFlippedSV = useSharedValue<number>(-1);
    const translateXSV = useSharedValue<number>(0);
    const [activeDataPointLocal, setActiveDataPointLocal] = useState<
        undefined | DataPoint
    >(undefined);
    const forceRerender = useForceReRender();

    useAnimatedReaction(
        () => ({
            componentWidth: activeComponentWidthSV.value,
            xPosition: activePointPositionX.value,
        }),
        ({componentWidth, xPosition}) => {
            if (componentWidth === 0) {
                return;
            }
            const requiredSpace =
                componentWidth + SPACE_BETWEEN_COMPONENT_AND_LINE;
            const availableSpace = isRTL ? xPosition : width - xPosition;

            if (isFlippedSV.value === -1) {
                isFlippedSV.value = availableSpace < requiredSpace ? 1 : 0;
            } else if (
                isFlippedSV.value === 0 &&
                availableSpace < requiredSpace
            ) {
                isFlippedSV.value = 1;
            } else if (
                isFlippedSV.value === 1 &&
                availableSpace > requiredSpace + SIDE_SWITCH_HYSTERESIS
            ) {
                isFlippedSV.value = 0;
            }

            const targetX = isRTL
                ? isFlippedSV.value === 1
                    ? xPosition - width + requiredSpace
                    : xPosition - width - SPACE_BETWEEN_COMPONENT_AND_LINE
                : isFlippedSV.value === 1
                  ? xPosition - requiredSpace
                  : xPosition + SPACE_BETWEEN_COMPONENT_AND_LINE;

            const clampedX = isRTL
                ? Math.min(0, Math.max(componentWidth - width, targetX))
                : Math.max(0, Math.min(width - componentWidth, targetX));

            translateXSV.value = withTiming(clampedX, {duration: 100});
        },
        [width, isRTL],
    );

    const viewAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: translateXSV.value}],
            opacity:
                activeComponentWidthSV.value === 0 ? 0 : pointOpacity.value,
        };
    });

    useAnimatedReaction(
        () => {
            return activePointSharedValue.value;
        },
        (current, previous) => {
            if (current !== undefined && previous === undefined) {
                scheduleOnRN(forceRerender);
            }
            if (activePointComponent !== undefined) {
                scheduleOnRN(setActiveDataPointLocal, current);
            }
        },
        [activePointSharedValue],
    );

    return (
        <Animated.View
            style={[{zIndex: 2, flexDirection: 'row'}, viewAnimatedStyle]}
        >
            <View
                onLayout={event => {
                    const {width: componentWidth} = event.nativeEvent.layout;
                    if (componentWidth > 0) {
                        activeComponentWidthSV.value = componentWidth;
                    }
                }}
            >
                {activePointComponentWithSharedValue !== undefined &&
                    activePointComponentWithSharedValue !== undefined &&
                    (activePointComponentWithSharedValue(
                        activePointSharedValue,
                    ) as React.ReactNode)}

                {activePointComponentWithSharedValue === undefined &&
                    activeDataPointLocal &&
                    activePointComponent !== undefined &&
                    (activePointComponent(
                        activeDataPointLocal,
                    ) as React.ReactNode)}
            </View>
        </Animated.View>
    );
};

export default ActivePointComponentWrapper;
