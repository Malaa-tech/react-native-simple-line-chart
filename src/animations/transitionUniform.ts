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
  getPathFromPathArray,
  getPathXArrayFromPath,
  getPathYArrayFromPath,
  scaleArraySize,
} from './utils';

const useTransitionUniform: animationHook = ({ path, duration, enabled }) => {
  if (!enabled) {
    return {};
  }
  const DURATION = duration || 0;
  const pathYSV = useSharedValue<number[]>([]);
  const pathXSV = useSharedValue<number[]>([]);

  useEffect(() => {
    const newPathXArray = getPathXArrayFromPath(path?.d || '');
    const newPathYArray = getPathYArrayFromPath(path?.d || '');

    console.log({
      pathSize: path?.data.length,
      pathXSVSize: pathXSV.value.length,
      pathYSVSize: pathYSV.value.length,
    });

    if (path?.data.length !== undefined && pathXSV.value.length === 0) {
      // initial setup
      pathXSV.value = newPathXArray;
      pathYSV.value = newPathYArray;
    } else if (path?.data.length && pathXSV.value.length < path?.data.length) {
      // scaling up
      pathXSV.value = scaleArraySize(pathXSV.value, path?.data.length);
      pathYSV.value = scaleArraySize(pathYSV.value, path?.data.length);

      pathXSV.value = withTiming(newPathXArray, {
        duration: DURATION / 2,
      });
      pathYSV.value = withTiming(newPathYArray, {
        duration: DURATION / 2,
      });
    } else if (path?.data.length && pathXSV.value.length > path?.data.length) {
      // scaling down
      const pathArrayXAfter = scaleArraySize(
        newPathXArray,
        pathXSV.value.length
      );
      pathXSV.value = withTiming(pathArrayXAfter, {
        duration: DURATION / 2,
      });
      const pathArrayYAfter = scaleArraySize(
        newPathYArray,
        pathYSV.value.length
      );

      pathYSV.value = withTiming(pathArrayYAfter, {
        duration: DURATION / 2,
      });
    } else {
      // no scaling
      pathXSV.value = withTiming(newPathXArray, {
        duration: DURATION / 2,
      });
      pathYSV.value = withTiming(newPathYArray, {
        duration: DURATION / 2,
      });
    }
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

  const derivedPath = useDerivedValue(() => {
    const path = getPathFromPathArray({
      pathX: pathXSV.value,
      pathY: pathYSV.value,
    });

    // const points = new Array(pathXSV.value.length).fill(0).map((value, i) => {
    //   return {
    //     x: pathXSV.value[i],
    //     y: pathYSV.value[i],
    //   };
    // });
    // console.log({ points, path: svgBezierPath(points, 2, 'complex') });
    // const complexPath = svgBezierPath(points, 0.2, 'simple');
    // const anotherPath = createRoundedPathString(points);
    // console.log(anotherPath);

    return path;
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

  const result: any = {
    lineWrapperAnimatedStyle,
    lineAnimatedProps,
    startAnimation,
    endPointAnimation,
  };

  return result;
};

export default useTransitionUniform;
