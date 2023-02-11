import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { AnimationConfig } from './types';

const useChartAnimation = (props: AnimationConfig | undefined) => {
  const DURATION = props?.duration || 0;
  //   const ANIMATION_TYPE = props?.animationType || 'fade';

  const opacitySV = useSharedValue<number>(1);

  const show = () => {
    'worklet';

    opacitySV.value = withTiming(1, { duration: DURATION / 2 });
  };

  const startAnimation = ({ action }: { action: () => void }) => {
    opacitySV.value = withTiming(0, { duration: DURATION / 2 }, (finished) => {
      if (finished) {
        runOnJS(action)();
        show();
      }
    });
  };

  const lineWrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacitySV.value,
    };
  });

  return {
    lineWrapperAnimatedStyle,
    opacitySV,
    show,
    startAnimation,
  };
};

export default useChartAnimation;
