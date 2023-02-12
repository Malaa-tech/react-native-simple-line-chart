/* eslint-disable no-unsafe-optional-chaining */
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
    // if (pathXSV.value.length !== path?.data.length) {
    //   console.log('old');
    //   console.log({
    //     pathXSV: pathXSV.value,
    //     pathYSV: pathYSV.value,
    //     test: getPathXArrayFromPath(path?.d || ''),
    //     testlen: getPathXArrayFromPath(path?.d || '').length,
    //     length: pathYSV.value.length,
    //   });
    //   pathXSV.value = getPathXArrayFromPath(path?.d || '');
    //   pathYSV.value = getPathYArrayFromPath(path?.d || '');
    //   console.log('new');
    //   console.log({
    //     pathXSV: pathXSV.value,
    //     pathYSV: pathYSV.value,
    //     length: pathYSV.value.length,
    //   });
    // } else {

    // console.log('old');
    // console.log({
    //   pathXSV: pathXSV.value,
    //   pathYSV: pathYSV.value,
    //   test: getPathXArrayFromPath(path?.d || '', path?.data.length),
    //   testlen: getPathXArrayFromPath(path?.d || '', path?.data.length).length,
    //   testY: getPathYArrayFromPath(path?.d || '', path?.data.length),
    //   testYlen: getPathYArrayFromPath(path?.d || '', path?.data.length).length,
    //   length: path?.data.length,
    // });

    if (path?.data.length && pathXSV.value.length < path?.data.length) {
      pathXSV.value = new Array(path?.data.length - pathXSV.value.length)
        .fill(0)
        .concat(pathXSV.value);
      pathYSV.value = new Array(path?.data.length - pathYSV.value.length)
        .fill(0)
        .concat(pathYSV.value);
    } else if (path?.data.length && pathXSV.value.length > path?.data.length) {
      pathXSV.value = pathXSV.value.slice(
        pathXSV.value.length - path?.data.length
      );
      pathYSV.value = pathYSV.value.slice(
        pathYSV.value.length - path?.data.length
      );
    }

    pathXSV.value = withTiming(
      getPathXArrayFromPath(path?.d || '', path?.data.length as any),
      {
        duration: DURATION / 2,
      }
    );
    pathYSV.value = withTiming(
      getPathYArrayFromPath(path?.d || '', path?.data.length as any),
      {
        duration: DURATION / 2,
      }
    );
    // }
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
    console.log({
      pathX: pathXSV.value.length,
      pathY: pathYSV.value.length,
    });
    const path = getPathFromPathArray({
      pathX: pathXSV.value,
      pathY: pathYSV.value,
    });
    // console.log('path', path);
    return path;
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

const getPathYArrayFromPath = (
  path: string,
  desiredNumberOfElements: number
) => {
  'worklet';

  const resultPath = path
    .replace('M', '')
    .split('L')
    .map((point) => {
      return parseFloat(point.trim().split(',')[1] || '0');
    });

  if (resultPath.length === desiredNumberOfElements) {
    return resultPath;
  }

  if (resultPath.length < desiredNumberOfElements) {
    return resultPath.concat(
      new Array(desiredNumberOfElements - resultPath.length).fill(0)
    );
  }

  if (resultPath.length > desiredNumberOfElements) {
    return resultPath.slice(0, desiredNumberOfElements);
  }

  return resultPath;
};

const getPathXArrayFromPath = (
  path: string,
  desiredNumberOfElements: number
) => {
  'worklet';

  const resultPath = path
    .replace('M', '')
    .split('L')
    .map((point) => {
      return parseFloat(point.trim().split(',')[0] || '0');
    });

  if (resultPath.length === desiredNumberOfElements) {
    return resultPath;
  }

  if (resultPath.length < desiredNumberOfElements) {
    return resultPath.concat(
      new Array(desiredNumberOfElements - resultPath.length).fill(0)
    );
  }

  if (resultPath.length > desiredNumberOfElements) {
    return resultPath.slice(0, desiredNumberOfElements);
  }

  return resultPath;
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
