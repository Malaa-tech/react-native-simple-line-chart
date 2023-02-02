import { ColorValue } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import ActivePointComponent from './ActivePointComponentWrapper';

export type EndPointConfig = {
  color?: ColorValue;
  radius?: number;
  animated?: boolean;
};

export type ActivePointConfig = {
  color?: ColorValue;
  borderColor?: ColorValue;
  radius?: number;
  showVerticalLine?: boolean;
  lineColor?: ColorValue;
  lineOpacity?: number;
  lineWidth?: number;
  lineDashArray?: number[];
};

export type AnimationType = 'slide' | 'fade';

export type DataPoint = {
  value: number;
  extraData?: any;
};

export type ActivePointComponent = (
  activePoint?: DataPoint | SharedValue<DataPoint | undefined>
) => React.ReactNode;

export type LineCurve = 'linear' | 'cardinal' | 'step' | 'monotone';

export type Line = {
  data: DataPoint[];
  activePointConfig?: ActivePointConfig;
  lineColor?: ColorValue | ColorValue[]; // can be linear gradient
  fillColor?: ColorValue;
  activePointComponent?: ActivePointComponent;
  lineWidth?: number;
  endPointConfig?: EndPointConfig;
  curve?: LineCurve;
  passSharedValueToActivePointComponent?: boolean;
};

export type ExtraConfig = {
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
};
