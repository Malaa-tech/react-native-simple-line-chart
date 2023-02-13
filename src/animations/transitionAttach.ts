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
} from './utils';

const useTransitionAttach: animationHook = ({ path, duration, enabled }) => {
  if (!enabled) {
    return {};
  }
  const DURATION = duration || 0;
  const pathYSV = useSharedValue<number[]>([]);
  const pathXSV = useSharedValue<number[]>([]);

  useEffect(() => {
    if (path?.data.length && pathXSV.value.length < path?.data.length) {
      pathXSV.value = new Array(path?.data.length - pathXSV.value.length)
        .fill(0)
        .concat(pathXSV.value);
      pathYSV.value = new Array(path?.data.length - pathYSV.value.length)
        .fill(0)
        .concat(pathYSV.value);

      pathXSV.value = withTiming(getPathXArrayFromPath(path?.d || ''), {
        duration: DURATION / 2,
      });
      pathYSV.value = withTiming(getPathYArrayFromPath(path?.d || ''), {
        duration: DURATION / 2,
      });
    } else if (path?.data.length && pathXSV.value.length > path?.data.length) {
      // const pathArrayXAfter = fillArray(
      //   getPathXArrayFromPath(path?.d || ''),
      //   pathXSV.value.length
      // );
      const pathArrayXAfter = [
        ...new Array(
          pathXSV.value.length - getPathXArrayFromPath(path?.d || '').length
        ).fill(getPathXArrayFromPath(path?.d || '')[0]),
        ...getPathXArrayFromPath(path?.d || ''),
      ];
      pathXSV.value = withTiming(pathArrayXAfter, {
        duration: DURATION / 2,
      });

      // const pathArrayYAfter = fillArray(
      //   getPathYArrayFromPath(path?.d || ''),
      //   pathYSV.value.length
      // );
      const pathArrayYAfter = [
        ...new Array(
          pathXSV.value.length - getPathYArrayFromPath(path?.d || '').length
        ).fill(getPathYArrayFromPath(path?.d || '')[0]),
        ...getPathYArrayFromPath(path?.d || ''),
      ];
      pathYSV.value = withTiming(pathArrayYAfter, {
        duration: DURATION / 2,
      });
    } else {
      pathXSV.value = withTiming(getPathXArrayFromPath(path?.d || ''), {
        duration: DURATION / 2,
      });
      pathYSV.value = withTiming(getPathYArrayFromPath(path?.d || ''), {
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

  const derivedPath = useDerivedValue(() => {
    const path = getPathFromPathArray({
      pathX: pathXSV.value,
      pathY: pathYSV.value,
    });
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

export default useTransitionAttach;
