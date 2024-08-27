/* eslint-disable no-unsafe-optional-chaining */
import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import {
  animationHook,
  endPointAnimationFunction,
  startAnimationFunction,
} from 'src/animations/animations';
import {
  getPathXArrayFromPath,
  getPathYArrayFromPath,
  svgBezierPath,
} from './utils';

const useTransitionAttach: animationHook = ({ path, duration, enabled }) => {
  if (!enabled) {
    return {
      lineAnimatedProps: undefined,
      lineWrapperAnimatedStyle: undefined,
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

    if (path?.data.length && pathXSV.value.length < path?.data.length) {
      pathXSV.value = new Array(path?.data.length - pathXSV.value.length)
        .fill(0)
        .concat(pathXSV.value);
      pathYSV.value = new Array(path?.data.length - pathYSV.value.length)
        .fill(0)
        .concat(pathYSV.value);

      const isInitial = pathXSV.value.length === 0;

      pathXSV.value = withTiming(newPathXArray, {
        duration: isInitial ? 0 : DURATION / 2,
      });
      pathYSV.value = withTiming(newPathYArray, {
        duration: isInitial ? 0 : DURATION / 2,
      });
    } else if (path?.data.length && pathXSV.value.length > path?.data.length) {
      const pathArrayXAfter = [
        ...new Array(pathXSV.value.length - newPathXArray.length).fill(
          newPathXArray[0]
        ),
        ...newPathXArray,
      ];
      pathXSV.value = withTiming(pathArrayXAfter, {
        duration: DURATION / 2,
      });

      const pathArrayYAfter = [
        ...new Array(pathXSV.value.length - newPathYArray.length).fill(
          newPathYArray[0]
        ),
        ...newPathYArray,
      ];
      pathYSV.value = withTiming(pathArrayYAfter, {
        duration: DURATION / 2,
      });
    } else {
      pathXSV.value = withTiming(newPathXArray, {
        duration: DURATION / 2,
      });
      pathYSV.value = withTiming(newPathYArray, {
        duration: DURATION / 2,
      });
    }

    // }
  }, [path?.d]);

  const startAnimation: startAnimationFunction = ({
    action,
  }: {
    action: () => void;
  }) => {
    action();
  };

  const lineWrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1,
    };
  });

  const generatePointsFromXAndY = (x: number[], y: number[]) => {
    'worklet';

    const points = new Array(x.length).fill(0).map((_value, i) => {
      if (x !== undefined && y !== undefined) {
        return {
          x: x[i],
          y: y[i],
        };
      }
      return {
        x: 0,
        y: 0,
      };
    });
    return points;
  };

  const derivedPath = useDerivedValue(() => {
    if (pathXSV.value !== undefined && pathYSV.value !== undefined) {
      const points = generatePointsFromXAndY(pathXSV.value, pathYSV.value);
      return svgBezierPath(points, 0.03, 'complex');
    }

    return '';
  }, [path?.d]);

  const lineAnimatedProps = useAnimatedProps(() => {
    return {
      d: derivedPath.value,
    };
  });

  const endPointAnimation: endPointAnimationFunction = ({
    currentYPosition,
    newYPosition,
  }) => {
    currentYPosition.value = withTiming(newYPosition, {
      duration: DURATION / 2,
    });
  };

  const result = {
    lineWrapperAnimatedStyle,
    lineAnimatedProps,
    startAnimation,
    endPointAnimation,
  };

  return result;
};

export default useTransitionAttach;
