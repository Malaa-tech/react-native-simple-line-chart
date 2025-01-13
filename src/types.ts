import {ComponentProps} from 'react';
import {ColorValue} from 'react-native';
import {SharedValue} from 'react-native-reanimated';
import {NumberProp, Path} from 'react-native-svg';

/**
 * The props for the LineChart component
 */
export type LineChart = {
    /**
     * The data for the chart
     * @required at least one line is required
     */
    lines: Line[];
    /**
     * The height of the chart
     * @default 200
     */
    height?: number;
    /**
     * The width of the chart (default value is the width of the screen)
     */
    width?: number;
    /**
     * The background color of the chart
     * @default 'white'
     */
    backgroundColor?: string;
    /**
     * More configuration for the chart
     */
    extraConfig?: ExtraConfig;
    /**
     * This will run when the user taps on the a point on the chart
     */
    onPointFocus?: onPointFocus;
    /**
     * This will run when the user release the tap on the a point on the chart
     */
    onPointLoseFocus?: onPointLoseFocus;
    /**
     * The shared value that will hold the active point (this is useful if you want to use the active point in other components)
     */
    activePointSharedValue?: DataPointSharedValue;
};

/**
 * The line configuration object
 */
export interface Line {
    /**
     * Optional key to indicate that the line has changed (helps with triggering animations)
     */
    key?: string;
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
     * the opacity of the begging of the line (gives it gradient effect if you have colored background) (a percentage between 0 - 1)
     * @default "1"
     */
    leadingOpacity?: NumberProp | {leadingPercentage: number; opacity: number};
    /**
     * the opacity of the end of the line (gives it gradient effect if you have colored background) (a percentage between 0 - 1)
     * @default "1"
     */
    trailingOpacity?:
        | NumberProp
        | {trailingPercentage: number; opacity: number};
    /**
     * specify the strokeDasharray for the line
     */
    strokeDasharray?: ComponentProps<typeof Path>['strokeDasharray'];
    /**
     * The component to render when the user taps on the chart
     */
    activePointComponent?: ActivePointComponent;
    /**
     * The same as (activePointComponent) but the component will receive the shared value of the active point (reanimated value) this can make the chart much more performant
     */
    activePointComponentWithSharedValue?: ActivePointComponentSharedValue;
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
     * Toggle this to create an area chart, (it will take the same color as the lineColor)
     * @default 'false'
     */
    isAreaChart?: boolean;
}

export type DataPoint<T = any> = {
    /**
     * disable the active point for this data point
     */
    disableActivePoint?: boolean;
    /**
     * Any extra data you want to pass to the data point (this will be passed to the active point component)
     */
    extraData?: T;
    /**
     * The x value of the data point (if your data is a time series then this should be a timestamp)
     */
    x: number;
    /**
     * The y value of the data point, it also represents y2 if you are doing a range chart
     */
    y: number;
    /**
     * The second value of the data point, in case you are doing a range chart, if not supplied then the chart will be a normal line chart
     */
    y2?: number;
};

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
     * Weather the end point should be animated (pulse animation)
     */
    animated?: boolean;
}

/**
 * The configuration for the active point (the point that is shown when the user taps on the chart)
 */
export interface ActivePointConfig {
    /**
     * The color of the active point circle
     * @default 'black'
     */
    color?: ColorValue;
    /**
     * the border color for the active point circle
     * @default 'black'
     */
    borderColor?: ColorValue;
    /**
     * the border width for the active point circle
     * @default 2
     */
    borderWidth?: number;
    /**
     * the border radius for the active point circle
     * @default 4
     */
    radius?: number;
    /**
     * Weather to show a vertical line from the active point to the x axis
     * @default false
     */
    showVerticalLine?: boolean;
    /**
     * Weather to show a circle around the active point
     * @default true
     */
    showActivePointCircle?: boolean;
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
    /**
     * Weather to animate the transition of the active point
     * @default false
     */
    animateTransition?: boolean;
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
    alwaysStartYAxisFromZero?: boolean;
    /**
     * Supplying simultaneousHandlers will make the chart work with other gesture handlers
     */
    simultaneousHandlers?: any;
    /**
     * Supplying activeOffsetX for the gesture handler, if the offset is reached, the simultaneousHandlers will be disabled
     * @default [0,0]
     */
    activeOffsetX?: [number, number];
    /**
     * Space between the end of the chart the the end of the view (like paddingEnd)
     * @default 0
     */
    endSpacing?: number;
    /**
     * supplying this function will allow you to customize the y axis min and max values
     */
    calculateChartYAxisMinMax?: calculateChartAxisMinMax;
    /**
     * supplying this function will allow you to customize the x axis min and max values
     */
    calculateChartXAxisMinMax?: calculateChartAxisMinMax;
    /**
     * Animation configuration
     */
    animationConfig?: AnimationConfig;
}

/**
 * Setting this for enabling animations
 * limitations: animations doesn't work with area chart presentation
 * limitations: 'linear' curve type is the only supported type for animations
 * limitations: switching animations will cause a crash, and you will need to restart the app
 */
export interface AnimationConfig {
    /**
     * Animation Duration
     * @default 200
     */
    duration?: number;
    /**
     * Animation presets
     * @default 'fade'
     */
    animationType?: AnimationType;
}

export type AnimationType = 'fade' | 'transitionAttach' | 'transitionUniform';

export type LineCurve = 'linear' | 'cardinal' | 'step' | 'monotone';

export type ActivePointComponent = (activePoint?: DataPoint) => React.ReactNode;

export type DataPointSharedValue<T = any> = SharedValue<
    DataPoint<T> | undefined
>;
export type ActivePointComponentSharedValue = (
    activePoint: DataPointSharedValue,
) => React.ReactNode;

export type calculateChartAxisMinMax = (
    min: number,
    max: number,
) => {min: number; max: number};

export type onPointFocus = (activePoint: DataPoint) => void;
export type onPointLoseFocus = () => void;

export type LineChartRef = {
    setActiveIndex: (index: number | undefined) => void;
};
