import {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';

const useChartAnimation = ({ duration = 500 }: { duration: number }) => {
  const opacitySV = useSharedValue<number>(0);

  const show = () => {
    opacitySV.value = withTiming(1, { duration: duration / 2 });
  };

  const hide = () => {
    opacitySV.value = withTiming(0, { duration: duration / 2 });
  };

  const lineAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacitySV.value,
    };
  });

  const endPointAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacitySV.value,
    };
  });

  return {
    lineAnimatedStyle,
    endPointAnimatedStyle,
    opacitySV,
    show,
    hide,
  };
};

export default useChartAnimation;
