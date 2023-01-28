import { SharedValue } from 'react-native-reanimated';
import ActivePointComponent from './ActivePointComponentWrapper';

export type EndPointConfig = {
  color: string;
  radius: number;
  animated: boolean;
};

export type ActivePointConfig = {
  color: string;
  borderColor: string;
  radius: number;
  line: boolean;
  lineColor: string;
  lineOpacity: number;
  lineWidth: number;
  lineDashArray: number[];
  hideAfterActivePoint: boolean;
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
  lineColor?: string | string[]; // can be linear gradient
  fillColor?: string;
  activePointComponent?: ActivePointComponent;
  lineWidth?: number;
  endPoint?: EndPointConfig;
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
