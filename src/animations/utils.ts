export const getPathYArrayFromPath = (path: string) => {
    'worklet';

    const resultPath = path
        .replace('M', '')
        .split('L')
        .map(point => {
            return parseFloat(point.trim().split(',')[1] || '0');
        });

    return resultPath;
};

export const getPathXArrayFromPath = (path: string) => {
    'worklet';

    const resultPath = path
        .replace('M', '')
        .split('L')
        .map(point => {
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
    numberOfElements: number,
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

export const scaleArraySize: any = (
    array: number[],
    numberOfElements: number,
) => {
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

const controlPoint = (
    current: number[],
    previous: number[],
    next: number[],
    reverse: boolean,
    smoothing: number,
) => {
    'worklet';

    const p = previous || current;
    const n = next || current;
    // Properties of the opposed-line
    const lengthX = (n[0] as number) - (p[0] as number);
    const lengthY = (n[1] as number) - (p[1] as number);
    const o = {
        angle: Math.atan2(lengthY, lengthX),
        length: Math.sqrt(lengthX ** 2 + lengthY ** 2),
    };
    // If is end-control-point, add PI to the angle to go backward
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    // The control point position is relative to the current point
    const x = (current[0] as number) + Math.cos(angle) * length;
    const y = (current[1] as number) + Math.sin(angle) * length;
    return [x, y];
};

export const svgBezierPath = (
    points: any,
    smoothing: any,
    strategy: 'simple' | 'complex' | 'bezier',
) => {
    'worklet';

    const traversed = points.map((p: any) => [p.x, p.y]);
    // build the d attributes by looping over the points
    return traversed.reduce((acc: any, point: any, i: any, a: any) => {
        if (i === 0) {
            return `M ${point[0]},${point[1]}`;
        }
        const cps = controlPoint(a[i - 1], a[i - 2], point, false, smoothing);
        const cpsX: any = cps[0];
        const cpsY: any = cps[1];

        const cpe = controlPoint(point, a[i - 1], a[i + 1], true, smoothing);
        const cpeX: any = cpe[0];
        const cpeY: any = cpe[1];
        if (strategy === 'simple') {
            return `${acc} Q ${(cpsX + cpeX) / 2},${(cpsY + cpeY) / 2} ${point[0]},${
                point[1]
            }`;
        }
        if (strategy === 'complex') {
            return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
        }
        if (strategy === 'bezier') {
            const p0 = a[i - 2] || a[i - 1];
            const x0 = p0[0];
            const y0 = p0[1];
            const p1 = a[i - 1];
            const x1 = p1[0];
            const y1 = p1[1];
            const x = point[0];
            const y = point[1];
            const cp1x = (2 * x0 + x1) / 3;
            const cp1y = (2 * y0 + y1) / 3;
            const cp2x = (x0 + 2 * x1) / 3;
            const cp2y = (y0 + 2 * y1) / 3;
            const cp3x = (x0 + 4 * x1 + x) / 6;
            const cp3y = (y0 + 4 * y1 + y) / 6;
            if (i === a.length - 1) {
                return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${cp3x},${cp3y} C${x},${y} ${x},${y} ${x},${y}`;
            }
            return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${cp3x},${cp3y}`;
        }
        return null;
    }, '');
};
