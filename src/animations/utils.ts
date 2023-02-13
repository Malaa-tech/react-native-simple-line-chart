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

export const fillArray = (
  array: number[],
  numberOfElements: number
): number[] => {
  'worklet';

  const newArray = [];
  const step = array.length / numberOfElements;
  for (let i = 0; i < numberOfElements; i++) {
    const numberToBeAdded = array[Math.floor(i * step)];
    newArray.push(numberToBeAdded);
  }
  return newArray as number[];
};

export const scaleArraySize = (array: number[], numberOfElements: number) => {
  if (array.length === numberOfElements) {
    console.warn('the provided array is the same size');
    return array;
  }

  const result: number[] = [];

  if (array.length < numberOfElements) {
    const step = array.length / numberOfElements;
    for (let i = 0; i < numberOfElements; i++) {
      let numberToBeAdded = array[Math.floor(i * step)] as number;
      if (numberToBeAdded === result[i - 1]) {
        const nextNumber = array[Math.floor((i + 1) * step)] as number;
        const numberInTheMiddle = (nextNumber + numberToBeAdded) / 2;
        if (numberInTheMiddle) {
          numberToBeAdded = numberInTheMiddle;
        }
      }
      result.push(numberToBeAdded);
    }
  }

  return result;
};

// const controlPoint = (current, previous, next, reverse, smoothing) => {
//   'worklet';
//   const p = previous || current;
//   const n = next || current;
//   // Properties of the opposed-line
//   const lengthX = n[0] - p[0];
//   const lengthY = n[1] - p[1];
//   const o = {
//     angle: Math.atan2(lengthY, lengthX),
//     length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
//   };
//   // If is end-control-point, add PI to the angle to go backward
//   const angle = o.angle + (reverse ? Math.PI : 0);
//   const length = o.length * smoothing;
//   // The control point position is relative to the current point
//   const x = current[0] + Math.cos(angle) * length;
//   const y = current[1] + Math.sin(angle) * length;
//   return [x, y];
// };

// export const svgBezierPath = (points, smoothing, strategy) => {
//   'worklet';
//   const traversed = points.map((p) => [p.x, p.y]);
//   // build the d attributes by looping over the points
//   return traversed.reduce((acc, point, i, a) => {
//     if (i === 0) {
//       return `M ${point[0]},${point[1]}`;
//     } else {
//       const cps = controlPoint(a[i - 1], a[i - 2], point, false, smoothing);
//       const cpsX = cps[0];
//       const cpsY = cps[1];

//       const cpe = controlPoint(point, a[i - 1], a[i + 1], true, smoothing);
//       const cpeX = cpe[0];
//       const cpeY = cpe[1];
//       if (strategy === 'simple') {
//         return `${acc} Q ${(cpsX + cpeX) / 2},${(cpsY + cpeY) / 2} ${
//           point[0]
//         },${point[1]}`;
//       } else if (strategy === 'complex') {
//         return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
//       } else if (strategy === 'bezier') {
//         const p0 = a[i - 2] || a[i - 1];
//         const x0 = p0[0];
//         const y0 = p0[1];
//         const p1 = a[i - 1];
//         const x1 = p1[0];
//         const y1 = p1[1];
//         const x = point[0];
//         const y = point[1];
//         const cp1x = (2 * x0 + x1) / 3;
//         const cp1y = (2 * y0 + y1) / 3;
//         const cp2x = (x0 + 2 * x1) / 3;
//         const cp2y = (y0 + 2 * y1) / 3;
//         const cp3x = (x0 + 4 * x1 + x) / 6;
//         const cp3y = (y0 + 4 * y1 + y) / 6;
//         if (i === a.length - 1) {
//           return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${cp3x},${cp3y} C${x},${y} ${x},${y} ${x},${y}`;
//         }
//         return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${cp3x},${cp3y}`;
//       }
//       return null;
//     }
//   }, '');
// };

// export function createRoundedPathString(pathCoords) {
//   'worklet';

//   const path = [];
//   const curveRadius = 3;

//   // Reset indexes, so there are no gaps
//   pathCoords = pathCoords.slice();

//   for (let i = 0; i < pathCoords.length; i++) {
//     // 1. Get current coord and the next two (startpoint, cornerpoint, endpoint) to calculate rounded curve
//     const c2Index =
//       i + 1 > pathCoords.length - 1 ? (i + 1) % pathCoords.length : i + 1;
//     const c3Index =
//       i + 2 > pathCoords.length - 1 ? (i + 2) % pathCoords.length : i + 2;

//     const c1 = pathCoords[i];
//     const c2 = pathCoords[c2Index];
//     const c3 = pathCoords[c3Index];

//     // 2. For each 3 coords, enter two new path commands: Line to start of curve, bezier curve around corner.

//     // Calculate curvePoint c1 -> c2
//     const c1c2Distance = Math.sqrt(
//       Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2)
//     );
//     const c1c2DistanceRatio = (c1c2Distance - curveRadius) / c1c2Distance;
//     const c1c2CurvePoint = [
//       ((1 - c1c2DistanceRatio) * c1.x + c1c2DistanceRatio * c2.x).toFixed(1),
//       ((1 - c1c2DistanceRatio) * c1.y + c1c2DistanceRatio * c2.y).toFixed(1),
//     ];

//     // Calculate curvePoint c2 -> c3
//     const c2c3Distance = Math.sqrt(
//       Math.pow(c2.x - c3.x, 2) + Math.pow(c2.y - c3.y, 2)
//     );
//     const c2c3DistanceRatio = curveRadius / c2c3Distance;
//     const c2c3CurvePoint = [
//       ((1 - c2c3DistanceRatio) * c2.x + c2c3DistanceRatio * c3.x).toFixed(1),
//       ((1 - c2c3DistanceRatio) * c2.y + c2c3DistanceRatio * c3.y).toFixed(1),
//     ];

//     // If at last coord of polygon, also save that as starting point
//     if (i === pathCoords.length - 1) {
//       path.unshift('M' + c2c3CurvePoint.join(','));
//     }

//     // Line to start of curve (L endcoord)
//     path.push('L' + c1c2CurvePoint.join(','));
//     // Bezier line around curve (Q controlcoord endcoord)
//     path.push('Q' + c2.x + ',' + c2.y + ',' + c2c3CurvePoint.join(','));
//   }
//   // Logically connect path to starting point again (shouldn't be necessary as path ends there anyway, but seems cleaner)
//   path.push('Z');

//   return path.join(' ');
// }

// // smooth path radius edges
// export const smoothPathRadius = (path: string, radius: number) => {
//   'worklet';

//   return path;

//   const pathArray = path.split('L');

//   const newPathArray = pathArray.map((point, index) => {
//     if (index === 0) {
//       return point;
//     }
//     const previousPoint = pathArray[index - 1];
//     const previousPointX = parseFloat(previousPoint.split(',')[0]);
//     const previousPointY = parseFloat(previousPoint.split(',')[1]);
//     const currentPointX = parseFloat(point.split(',')[0]);
//     const currentPointY = parseFloat(point.split(',')[1]);

//     const distance = Math.sqrt(
//       Math.pow(currentPointX - previousPointX, 2) +
//         Math.pow(currentPointY - previousPointY, 2)
//     );

//     if (distance > radius) {
//       const angle = Math.atan2(
//         currentPointY - previousPointY,
//         currentPointX - previousPointX
//       );

//       const newPointX = previousPointX + Math.cos(angle) * radius;
//       const newPointY = previousPointY + Math.sin(angle) * radius;

//       return `${newPointX},${newPointY}`;
//     }

//     return point;
//   });

//   return newPathArray.join('L');
// };
