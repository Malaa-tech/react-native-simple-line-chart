import { ColorValue } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

/**
 * The configuration for the last point in the line
 */
export interface EndPointConfig {
  /**
   * The color of the end point
   */
  color?: ColorValue;
  /**
   * The border radius of the end point
   */
  radius?: number;
  /**
   * Weather the end point should be animated (paulse animation)
   */
  animated?: boolean;
}

/**
 * The configuration for the active point (the point that is shown when the user taps on the chart)
 */
export interface ActivePointConfig {
  /**
   * The color of the active point
   * @default 'black'
   */
  color?: ColorValue;
  /**
   * the border color for the active point
   * @default 'black'
   */
  borderColor?: ColorValue;
  /**
   * the border radius for the active point
   * @default 4
   */
  radius?: number;
  /**
   * Weather to show a vertical line from the active point to the x axis
   * @default false
   */
  showVerticalLine?: boolean;
  /**
   * The color of the vertical line
   * @default 'gray'
   */
  verticalLineColor?: ColorValue;
  /**
   * The opacity of the vertical line (number between 0 and 1)
   * @default 1
   */
  verticalLineOpacity?: number;
  /**
   * The width of the vertical line
   * @default 1
   */
  verticalLineWidth?: number;
  /**
   * The dash array for the vertical line (this will create a dashed line)
   * @default [0]
   */
  verticalLineDashArray?: number[];
}

export type AnimationType = 'slide' | 'fade';

export interface DataPoint {
  /**
   * The x value of the data point
   */
  x: number;
  /**
   * The y value of the data point (if your data is a time series then this should be a timestamp)
   */
  y: number;
  /**
   * Any extra data you want to pass to the data point (this will be passed to the active point component)
   */
  extraData?: any;
}

export type ActivePointComponent = (
  activePoint?: DataPoint | SharedValue<DataPoint | undefined>
) => React.ReactNode;

export type LineCurve = 'linear' | 'cardinal' | 'step' | 'monotone';

export type calculateChartYAxisMinMax = (
  min: number,
  max: number
) => { min: number; max: number };

/**
 * The line configuration object
 */
export interface Line {
  /**
   * The data points for the line containing an array of objects with x and y values and optionally extraData
   */
  data: DataPoint[];
  /**
   * The configuration for the active point (the point that is shown when the user taps on the chart)
   */
  activePointConfig?: ActivePointConfig;
  /**
   * The color of the line (supplying an array of colors will create a linear gradient)
   */
  lineColor?: ColorValue | ColorValue[];
  /**
   * The color of the fill under the line (creates an area chart)
   */
  fillColor?: ColorValue;
  /**
   * The component to render when the user taps on the chart
   */
  activePointComponent?: ActivePointComponent;
  /**
   * The width of the line
   */
  lineWidth?: number;
  /**
   * The end point configuration (the point appearing at the end of the line)
   */
  endPointConfig?: EndPointConfig;
  /**
   * The curve of the line
   * @default 'linear'
   */
  curve?: LineCurve;
  /**
   * Setting this to true will make the ActivePointComponent receive the shared value of the active point (reanimated value) this can make the chart much more performant
   * @default false
   */
  passSharedValueToActivePointComponent?: boolean;
}

/**
 * More configuration for the chart
 */
export interface ExtraConfig {
  /**
   * Settings this to true will make the active point always visible rather than visible when pressing on the chart
   * @default false
   */
  alwaysShowActivePoint?: boolean;
  /**
   * This is the index of the initial active point (the point that will be active when the chart first renders), if you didn't set (alwaysShowActivePoint) to true then there is no reason to set this.
   */
  initialActivePoint?: number;
  /**
   * Settings this to true will make the active point always visible after the user taps on the chart rather than hiding after pressOut
   */
  hideActivePointOnBlur?: boolean;
  /**
   * Settings this to true will make the chart y axis start from zero even if the minimum value is greater than zero
   */
  alwaysStartFromZero?: boolean;
  /**
   * Supplying simultaneousHandlers will make the chart work with other gesture handlers
   */
  simultaneousHandlers?: any;
  /**
   * Space between the end of the chart the the end of the view (like paddingEnd)
   * @default 0
   */
  endSpacing?: number;
  /**
   * supplying this function will allow you to customize the y axis min and max values
   */
  calculateChartYAxisMinMax?: calculateChartYAxisMinMax;
}
