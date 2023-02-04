import { Dimensions } from 'react-native';

export const ACTIVE_POINT_CONFIG = {
  color: 'black',
  borderColor: 'black',
  radius: 4,
  showVerticalLine: false,
  verticalLineColor: 'gray',
  verticalLineOpacity: 1,
  verticalLineWidth: 1,
  verticalLineDashArray: [0],
};

export const END_POINT = {
  color: 'black',
  animated: false,
  radius: 4,
};

export const EXTRA_CONFIG = {
  alwaysShowActivePoint: false,
  hideActivePointOnBlur: true,
  alwaysStartFromZero: false,
  initialActivePoint: 0,
  simultaneousHandlers: undefined,
  endSpacing: 0,
};

export const LINE_CHART = {
  height: 200,
  width: Dimensions.get('screen').width,
  backgroundColor: undefined,
  onPointFocus: () => false,
  onPointLoseFocus: () => false,
  activePointSharedValue: undefined,
  line2: undefined,
};
