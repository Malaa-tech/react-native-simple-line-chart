import { useCallback, useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { calculateChartYAxisMinMax, DataPoint, LineCurve } from './types';

export type PathObject = {
  d: string | null;
  x: d3.ScaleTime<number, number, never>;
  y: d3.ScaleLinear<number, number, never>;
  data: DataPoint[];
};

export const createNewPath = ({
  svgWidth,
  svgHeight,
  endSpacing,
  data,
  allData,
  isFilled = false,
  alwaysStartYAxisFromZero,
  curve,
  calculateChartYAxisMinMax,
}: {
  svgWidth: number;
  svgHeight: number;
  endSpacing: number;
  data: DataPoint[]; // this line data
  allData: DataPoint[]; // all lines data
  isFilled?: boolean;
  alwaysStartYAxisFromZero: boolean;
  curve?: LineCurve;
  calculateChartYAxisMinMax?: calculateChartYAxisMinMax;
}): PathObject => {
  const getChartMinMaxValues = (minValue: number, maxValue: number) => {
    if (alwaysStartYAxisFromZero) {
      return {
        min: 0,
        max: maxValue || 0,
      };
    }

    if (calculateChartYAxisMinMax) {
      return calculateChartYAxisMinMax(minValue, maxValue);
    }

    return {
      min: minValue,
      max: maxValue,
    };
  };

  // get the min and max values for the x axis
  const xDomain = d3.extent([...allData.map((val) => val.y)]);

  // create the y scale
  const y = d3
    .scaleLinear()
    .domain([
      getChartMinMaxValues(xDomain[0] || 0, xDomain[1] || 0).max as number,
      getChartMinMaxValues(xDomain[0] || 0, xDomain[1] || 0).min as number,
    ])
    .range([10, svgHeight - 10]);

  // create the x scale
  const x = d3
    .scaleUtc()
    .domain([data[0]?.x || 0, data[data.length - 1]?.x || 1])
    .range([0, svgWidth - endSpacing]);

  // create the line
  const getLine = () => {
    // if the line is filled, we need to add the bottom of the svg to the path
    if (isFilled) {
      return d3
        .area<DataPoint>()
        .x((d) => x(new Date(d?.x)))
        .y0(svgHeight + 10)
        .y1((d) => y(d.y));
    }

    // if the line is not filled, we just return the line
    return d3
      .line<DataPoint>()
      .x((d) => x(new Date(d?.x)))
      .y((d) => y(d.y));
  };

  const getCurve = () => {
    switch (curve) {
      case 'cardinal':
        return d3.curveCardinal;
      case 'step':
        return d3.curveStep;
      case 'linear':
        return d3.curveLinear;
      case 'monotone':
        return d3.curveMonotoneX;
      default:
        return d3.curveLinear;
    }
  };

  const line = getLine().curve(getCurve())(data);

  return {
    d: line,
    x,
    y,
    data,
  };
};

// given an array of numbers, return the number closest to the target
export const closest = (arr: number[], target: number) => {
  if (!arr || arr.length === 0) return null;
  if (arr.length === 1) return arr[0];

  for (let i = 1; i < arr.length; i++) {
    // As soon as a number bigger than target is found, return the previous or current
    // number depending on which has smaller difference to the target.
    if ((arr[i] as number) > target) {
      const p = arr[i - 1];
      const c = arr[i];
      if (p && c) {
        return Math.abs(p - target) < Math.abs(c - target) ? p : c;
      }
    }
  }
  // No number in array is bigger so return the last.
  return arr[arr.length - 1];
};

export const getIndexOfTheNearestXPoint = (
  array: DataPoint[],
  value: number
) => {
  'worklet';

  let closest = array[0];
  let closestIndex = 0;

  for (let i = 0; i < array.length; i++) {
    while (
      closest &&
      array[i] &&
      // @ts-ignore
      Math.abs(array[i].x - value) < Math.abs(closest.x - value)
    ) {
      closest = array[i];
      closestIndex = i;
    }
  }
  return closestIndex;
};

export const useForceReRender = () => {
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

  return forceUpdate;
};

export function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
