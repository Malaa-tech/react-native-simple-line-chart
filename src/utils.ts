/* eslint-disable no-unsafe-optional-chaining */
import { useCallback, useState } from 'react';
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

export const getIndexOfTheNearestXPoint = (
  array: DataPoint[],
  value: number
) => {
  'worklet';

  if (!array || array.length === 0) return -1;

  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // @ts-ignore
    const midValue = array[mid].x;

    if (midValue === value) {
      return mid;
    }
    if (midValue < value) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // At this point, left and right index are around the target value.
  // @ts-ignore
  const leftDistance = Math.abs(array[left]?.x - value);
  // @ts-ignore
  const rightDistance = Math.abs(array[right]?.x - value);

  return leftDistance < rightDistance ? left : right;
};

export const useForceReRender = () => {
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

  return forceUpdate;
};
