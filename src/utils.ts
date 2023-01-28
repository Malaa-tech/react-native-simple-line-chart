import * as d3 from 'd3';
import { DataPoint } from './types';

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
}: {
  svgWidth: number;
  svgHeight: number;
  endSpacing: number;
  data: DataPoint[]; // this line data
  allData: DataPoint[]; // all lines data
  isFilled?: boolean;
  alwaysStartFromZero: boolean;
  curve?: d3.CurveFactory;
}): PathObject => {
  const getMinimumChartValue = (minValue: number | undefined) => {
    if (alwaysStartFromZero) {
      return 0;
    }
    if (minValue) {
      // TODO: change this before open sourcing
      return minValue * 0.95;
    }

    return 0;
  };

  // get the min and max values for the x axis
  const xDomain = d3.extent([...allData.map((val) => val.value)]);

  // create the y scale
  const y = d3
    .scaleLinear()
    .domain([xDomain[1] || 0, getMinimumChartValue(xDomain[0])])
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

  const line = getLine().curve(curve || d3.curveCardinal)(data);

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
