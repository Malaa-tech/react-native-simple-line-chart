import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { PathObject } from './utils';

const useChartAnimation = ({
  duration,
  animationType,
  path,
}: {
  duration?: number;
  animationType?: 'fade' | 'fadeAndSlide';
  path?: PathObject;
}) => {
  const DURATION = duration || 0;
  const opacitySV = useSharedValue<number>(1);
  const pathYSV = useSharedValue<number[]>([]);
  const pathXSV = useSharedValue<number[]>([]);

  useEffect(() => {
    pathXSV.value = getPathXArrayFromPath(path?.d || '');
    if (pathXSV.value.length !== pathYSV.value.length) {
      pathYSV.value = getPathYArrayFromPath(path?.d || '');
    } else {
      pathYSV.value = withTiming(getPathYArrayFromPath(path?.d || ''), {
        duration: DURATION / 2,
      });
    }
  }, [path?.d]);

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
      opacity: animationType === 'fade' ? opacitySV.value : 1,
    };
  });

  const derivedPath = useDerivedValue(() => {
    return getPathFromPathArray({
      pathX: pathXSV.value,
      pathY: pathYSV.value,
    });
  }, [path?.d]);

  const lineAnimatedProps = useAnimatedProps(() => {
    return {
      d: derivedPath.value,
    };
  });

  return {
    lineAnimatedProps,
    lineWrapperAnimatedStyle,
    opacitySV,
    show,
    startAnimation,
  };
};

const getPathYArrayFromPath = (path: string) => {
  'worklet';

  return path
    .replace('M', '')
    .split('L')
    .map((point) => {
      return parseFloat(point.trim().split(',')[1] || '0');
    });
};

const getPathXArrayFromPath = (path: string) => {
  'worklet';

  return path
    .replace('M', '')
    .split('L')
    .map((point) => {
      return parseFloat(point.trim().split(',')[0] || '0');
    });
};

const getPathFromPathArray = ({
  pathX,
  pathY,
}: {
  pathX: number[];
  pathY: number[];
}) => {
  'worklet';

  if (pathY.length === 1 || pathY.length === 0) {
    return '';
  }

  const pathFromPathArray = pathY
    .map((y, index) => {
      return {
        x: pathX[index],
        y,
      };
    })
    .reduce((acc, current, currentIndex) => {
      if (currentIndex === pathY.length - 1) {
        return `${acc}${current.x},${current.y}`;
      }
      return `${acc}${current.x},${current.y}L`;
    }, 'M');

  return pathFromPathArray;
};

export default useChartAnimation;
