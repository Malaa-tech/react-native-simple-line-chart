export const getPathYArrayFromPath = (path: string) => {
  'worklet';

  const resultPath = path
    .replace('M', '')
    .split('L')
    .map((point) => {
      return parseFloat(point.trim().split(',')[1] || '0');
    });

  return resultPath;
};

export const getPathXArrayFromPath = (path: string) => {
  'worklet';

  const resultPath = path
    .replace('M', '')
    .split('L')
    .map((point) => {
      return parseFloat(point.trim().split(',')[0] || '0');
    });

  return resultPath;
};

export const getPathFromPathArray = ({
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

export const fillArray = (array: number[], numberOfElements: number) => {
  'worklet';

  const newArray = [];
  const step = array.length / numberOfElements;
  for (let i = 0; i < numberOfElements; i++) {
    newArray.push(array[Math.floor(i * step)]);
  }
  return newArray;
};
