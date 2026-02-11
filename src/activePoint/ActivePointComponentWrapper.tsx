import React, {useLayoutEffect, useState} from 'react';
import {I18nManager, View} from 'react-native';
import Animated, {
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
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
    activePointPositionY,
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
    const SPACE_BETWEEN_COMPONENT_AND_LINE = 15;
    const wrapperRef = React.useRef<View>(null);
    const activeComponentWidthSV = useSharedValue<number>(100);
    const [activeDataPointLocal, setActiveDataPointLocal] = useState<
        undefined | DataPoint
    >(undefined);
    const forceRerender = useForceReRender();

    const calculateWidth = () => {
        wrapperRef.current?.measureInWindow((_x, _y, width) => {
            activeComponentWidthSV.value = width;
        });
    };

    useLayoutEffect(() => {
        calculateWidth();
    }, [activePointComponent]);

    const componentPositionX = useDerivedValue(() => {
        const xPosition = activePointPositionX.value;

        if (I18nManager.isRTL) {
            if (
                xPosition <
                activeComponentWidthSV.value + SPACE_BETWEEN_COMPONENT_AND_LINE
            ) {
                return (
                    xPosition -
                    width +
                    (activeComponentWidthSV.value +
                        SPACE_BETWEEN_COMPONENT_AND_LINE)
                );
            }
            return xPosition - width - SPACE_BETWEEN_COMPONENT_AND_LINE;
        }
        if (
            width - xPosition <
            activeComponentWidthSV.value + SPACE_BETWEEN_COMPONENT_AND_LINE
        ) {
            return (
                xPosition -
                activeComponentWidthSV.value -
                SPACE_BETWEEN_COMPONENT_AND_LINE
            );
        }
        return xPosition + SPACE_BETWEEN_COMPONENT_AND_LINE;
    }, [activePointPositionX, activePointPositionY, activeComponentWidthSV]);

    const viewAnimatedStyle = useAnimatedStyle(() => {
        return {
            flexDirection: 'row',
            transform: [
                {
                    translateX: withTiming(
                        componentPositionX.value,
                        {
                            duration: 100,
                        },
                        finished => {
                            if (finished) {
                                scheduleOnRN(calculateWidth);
                            }
                        },
                    ),
                },
            ],
            opacity: pointOpacity.value,
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
        <Animated.View style={viewAnimatedStyle}>
            <View
                ref={wrapperRef}
                onLayout={event => {
                    const {width: componentWidth} = event.nativeEvent.layout;
                    activeComponentWidthSV.value = componentWidth;
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
