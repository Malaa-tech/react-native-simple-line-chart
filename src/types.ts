import { ColorValue } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

export interface EndPointConfig {
  color?: ColorValue;
  radius?: number;
  animated?: boolean;
}

export interface ActivePointConfig {
  color?: ColorValue;
  borderColor?: ColorValue;
  radius?: number;
  showVerticalLine?: boolean;
  verticalLineColor?: ColorValue;
  verticalLineOpacity?: number;
  verticalLineWidth?: number;
  verticalLineDashArray?: number[];
}

export type AnimationType = 'slide' | 'fade';

export interface DataPoint {
  x: number;
  y: number;
  extraData?: any;
}

export type ActivePointComponent = (
  activePoint?: DataPoint | SharedValue<DataPoint | undefined>
) => React.ReactNode;

export type LineCurve = 'linear' | 'cardinal' | 'step' | 'monotone';

export interface Line {
  data: DataPoint[];
  activePointConfig?: ActivePointConfig;
  lineColor?: ColorValue | ColorValue[]; // can be linear gradient
  fillColor?: ColorValue;
  activePointComponent?: ActivePointComponent;
  lineWidth?: number;
  endPointConfig?: EndPointConfig;
  curve?: LineCurve;
  passSharedValueToActivePointComponent?: boolean;
}

export interface ExtraConfig {
  alwaysShowActivePoint?: boolean;
  initialActivePoint?: number;
  hideActivePointOnBlur?: boolean;
  alwaysStartFromZero?: boolean;
  fadeStart?: boolean;
  rtl?: boolean;
  simultaneousHandlers?: any;
  endSpacing?: number;
  calculateChartYAxisMinMax?: (
    min: number,
    max: number
  ) => { min: number; max: number };
}
