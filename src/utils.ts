import * as d3 from 'd3';
import { DataPoint, LineCurve } from './types';

export type PathObject = {
  d: string | null;
  x: d3.ScaleTime<number, number, never>;
  y: d3.ScaleLinear<number, number, never>;
};

export const createNewPath = ({
  svgWidth,
  svgHeight,
  endSpacing,
  data,
  allData,
  isFilled = false,
  alwaysStartFromZero,
  curve,
  calculateChartYAxisMinMax,
}: {
  svgWidth: number;
  svgHeight: number;
  endSpacing: number;
  data: DataPoint[]; // this line data
  allData: DataPoint[]; // all lines data
  isFilled?: boolean;
  alwaysStartFromZero: boolean;
  curve?: LineCurve;
  calculateChartYAxisMinMax?: (
    min: number,
    max: number
  ) => { min: number; max: number };
}): PathObject => {
  const getChartMinMaxValues = (minValue: number, maxValue: number) => {
    if (alwaysStartFromZero) {
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
  const xDomain = d3.extent([...allData.map((val) => val.value)]);

  // create the y scale
  const y = d3
    .scaleLinear()
    .domain([
      getChartMinMaxValues(xDomain[1] || 0, xDomain[0] || 0).max as number,
      getChartMinMaxValues(xDomain[1] || 0, xDomain[0] || 0).min as number,
    ])
    .range([10, svgHeight - 10]);

  // create the x scale
  const x = d3
    .scaleUtc()
    .domain([
      new Date(data[0]?.extraData?.date),
      new Date(data[data.length - 1]?.extraData?.date),
    ])
    .range([0, svgWidth - endSpacing]);

  // create the line
  const getLine = () => {
    // if the line is filled, we need to add the bottom of the svg to the path
    if (isFilled) {
      return d3
        .area<DataPoint>()
        .x((d) => x(new Date(d.extraData?.date)))
        .y0(svgHeight + 10)
        .y1((d) => y(d.value));
    }

    // if the line is not filled, we just return the line
    return d3
      .line<DataPoint>()
      .x((d) => x(new Date(d.extraData?.date)))
      .y((d) => y(d.value));
  };

  const getCurve = () => {
    switch (curve) {
      case 'cardinal':
        return d3.curveCardinal;
      case 'step':
        return d3.curveStep;
      case 'linear':
        return d3.curveLinear;
      default:
        return d3.curveLinear;
    }
  };

  const line = getLine().curve(getCurve())(data);

  return {
    d: line,
    x,
    y,
  };
};

// given an array of numbers, return the number closest to the target
export const closest = (arr: number[], target: number) => {
  if (!arr || arr.length === 0) return null;
  if (arr.length === 1) return arr[0];

  for (let i = 1; i < arr.length; i++) {
    // As soon as a number bigger than target is found, return the previous or current
    // number depending on which has smaller difference to the target.
    if ((arr[i] as any) > target) {
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
