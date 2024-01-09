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
  data: DataPoint[];
  allData: DataPoint[];
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

  // get the min and max values for the y axis
  const [minY, maxY] = d3.extent([...allData.map((val) => val.y)]) || [0, 0];
  const [minX, maxX] = d3.extent([...allData.map((val) => val.x)]) || [0, 0];

  // Avoid repeated computation
  const chartMinMax = getChartMinMaxValues(minY || 0, maxY || 10);

  // create the y scale
  const y = d3
    .scaleLinear()
    .domain([chartMinMax.max as number, chartMinMax.min as number])
    .range([10, svgHeight - 10]);

  // create the x scale
  const x = d3
    .scaleUtc()
    .domain([minX || 0, maxX || 1])
    .range([0, svgWidth - endSpacing]);

  const curveMapping = {
    cardinal: d3.curveCardinal,
    step: d3.curveStep,
    linear: d3.curveLinear,
    monotone: d3.curveMonotoneX,
  };

  const selectedCurve = curveMapping[curve || 'linear'] || d3.curveLinear;

  // Precompute the date objects
  const dataWithDates = data.map((d) => ({ ...d, dateObj: new Date(d?.x) }));

  // create the line
  const getLine = () => {
    if (isFilled) {
      return d3
        .area<DataPoint & { dateObj: Date }>()
        .x((d) => x(d.dateObj))
        .x0((d, index) => {
          if (index === 0) {
            return x(d.dateObj) - 2;
          }
          return x(d.dateObj);
        })
        .y0(svgHeight + 10)
        .y1((d) => y(d.y));
    }
    return d3
      .line<DataPoint & { dateObj: Date }>()
      .x((d) => x(d.dateObj))
      .y((d) => y(d.y));
  };

  const line = getLine().curve(selectedCurve)(dataWithDates);

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
