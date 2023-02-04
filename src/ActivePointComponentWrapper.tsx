import React, { useState } from 'react';
import { I18nManager, View } from 'react-native';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  ActivePointComponent,
  ActivePointComponentSharedValue,
  DataPoint,
  DataPointSharedValue,
} from './types';

const AnimatedView = Animated.createAnimatedComponent(View);

const ActivePointComponentWrapper = ({
  activePointPosition,
  pointOpacity,
  width,
  activePointSharedValue,
  activePointComponentWithSharedValue,
  activePointComponent,
}: {
  activePointPosition: SharedValue<{ x: number; y: number }>;
  pointOpacity: SharedValue<number>;
  width: number;
  activePointSharedValue: DataPointSharedValue;
  activePointComponent?: ActivePointComponent;
  activePointComponentWithSharedValue?: ActivePointComponentSharedValue;
}) => {
  const SPACE_BETWEEN_COMPONENT_AND_LINE = 15;
  const activeComponentWidthSV = useSharedValue<number>(100);
  const [activeDataPointLocal, setActiveDataPointLocal] = useState<
    undefined | DataPoint
  >(undefined);

  const componentPositionX = useDerivedValue(() => {
    const xPosition = activePointPosition.value.x;

    if (I18nManager.isRTL) {
      if (
        xPosition <
        activeComponentWidthSV.value + SPACE_BETWEEN_COMPONENT_AND_LINE
      ) {
        return (
          xPosition -
          width +
          (activeComponentWidthSV.value + SPACE_BETWEEN_COMPONENT_AND_LINE)
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
  }, [activePointPosition, activeComponentWidthSV]);

  const viewAnimatedStyle = useAnimatedStyle(() => {
    return {
      flexDirection: 'row',
      transform: [
        {
          translateX: withTiming(componentPositionX.value, {
            duration: 100,
          }),
        },
      ],
      opacity: pointOpacity.value,
    };
  });

  useAnimatedReaction(
    () => {
      return activePointSharedValue.value;
    },
    () => {
      if (activePointComponentWithSharedValue !== undefined) {
        runOnJS(setActiveDataPointLocal)(activePointSharedValue.value);
      }
    },
    [activePointSharedValue]
  );

  return (
    <AnimatedView
      style={{
        ...viewAnimatedStyle,
      }}
    >
      <View
        onLayout={(event) => {
          const { width: componentWidth } = event.nativeEvent.layout;
          activeComponentWidthSV.value = componentWidth;
        }}
      >
        {activePointComponentWithSharedValue !== undefined &&
          activePointComponentWithSharedValue !== undefined &&
          activePointComponentWithSharedValue(activePointSharedValue)}

        {activePointComponentWithSharedValue === undefined &&
          activeDataPointLocal &&
          activePointComponent !== undefined &&
          activePointComponent(activeDataPointLocal)}
      </View>
    </AnimatedView>
  );
};

export default ActivePointComponentWrapper;
