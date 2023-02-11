import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { AnimationConfig } from './types';

const useChartAnimation = (props: AnimationConfig | undefined) => {
  const DURATION = props?.duration || 0;
  const ANIMATION_TYPE = props?.animationType || 'fade';

  const opacitySV = useSharedValue<number>(1);
  const translateYSV = useSharedValue<number>(0);

  const show = () => {
    'worklet';

    opacitySV.value = withTiming(1, { duration: DURATION / 2 });
    if (ANIMATION_TYPE === 'fadeAndSlide') {
      translateYSV.value = withTiming(0, {
        duration: DURATION / 2,
        easing: Easing.linear,
      });
    }
  };

  const startAnimation = ({ action }: { action: () => void }) => {
    opacitySV.value = withTiming(0, { duration: DURATION / 2 });
    if (ANIMATION_TYPE === 'fadeAndSlide') {
      translateYSV.value = withTiming(
        -20,
        { duration: DURATION / 2 },
        (finished) => {
          if (finished) {
            runOnJS(action)();
            translateYSV.value = 10;
            show();
          }
        }
      );
    }
  };

  const lineAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacitySV.value,
      transform: [{ translateY: translateYSV.value }],
    };
  });

  const endPointAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacitySV.value,
      transform: [{ translateY: translateYSV.value }],
    };
  });

  return {
    lineAnimatedStyle,
    endPointAnimatedStyle,
    opacitySV,
    show,
    startAnimation,
  };
};

export default useChartAnimation;
