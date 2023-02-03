/* eslint-disable react/no-array-index-key */
import React, { useCallback } from 'react';
import {
  interpolate,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import { View } from 'react-native';
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import ActivePoint from './ActivePoint';
import EndPoint from './EndPoint';
import { createNewPath, getIndexOfTheNearestXPoint } from './utils';
import {
  DataPoint,
  ExtraConfig,
  Line,
} from './typings/react-native-simple-line-chart';
import { ACTIVE_POINT_CONFIG, END_POINT } from './defaults';

const SvgPath = ({
  line1,
  line2,
  svgHeight,
  svgWidth,
  activeTouchX,
  activeTouch,
  backgroundColor,
  extraConfig,
  onPointChange,
}: {
  line1: Line;
  line2?: Line;
  svgHeight: number;
  svgWidth: number;
  activeTouchX: SharedValue<number>;
  activeTouch: SharedValue<boolean>;
  backgroundColor?: string;
  extraConfig: ExtraConfig;
  onPointChange: (point?: DataPoint) => void;
}) => {
  const allData = line1.data.concat(line2?.data || []);

  const activeIndex = useDerivedValue(() => {
    if (activeTouchX.value === 0 && extraConfig.initialActivePoint) {
      return extraConfig.initialActivePoint;
    }

    const percentage =
      (activeTouchX.value / (svgWidth - (extraConfig.endSpacing || 20))) * 100;

    const percentageToTimestampValue = interpolate(
      percentage,
      [0, 100],
      [line1.data[0]?.x || 0, line1.data[line1.data.length - 1]?.x || 100]
    );

    let activeIndexLocal = getIndexOfTheNearestXPoint(
      line1.data,
      percentageToTimestampValue
    );

    if (activeIndexLocal >= line1.data.length) {
      activeIndexLocal = line1.data.length - 1;
    }

    return activeIndexLocal;
  }, [activeTouchX, line1.data]);

  return (
    <>
      {[line1, line2]
        .filter((line) => line?.data)
        .map((line, index) => {
          if (line?.data) {
            return (
              <LineComponent
                key={`${index}`}
                line={line}
                allData={allData}
                svgHeight={svgHeight}
                svgWidth={svgWidth}
                activeIndex={activeIndex}
                activeTouch={activeTouch}
                backgroundColor={backgroundColor}
                identifier={`${index}`}
                extraConfig={extraConfig}
                onPointChange={index === 0 ? onPointChange : undefined}
              />
            );
          }
          // @ts-ignore
          return <View key={`${index}`} />;
        })}
    </>
  );
};

const LineComponent = ({
  line,
  allData,
  svgHeight,
  svgWidth,
  activeTouch,
  activeIndex,
  backgroundColor,
  identifier,
  extraConfig,
  onPointChange,
}: {
  line: Line;
  allData: DataPoint[];
  svgHeight: number;
  svgWidth: number;
  activeTouch: SharedValue<boolean>;
  activeIndex: SharedValue<number>;
  backgroundColor?: string;
  identifier: string;
  extraConfig: ExtraConfig;
  onPointChange?: (point?: DataPoint) => void;
}) => {
  const path = createNewPath({
    data: line.data,
    allData,
    endSpacing: extraConfig.endSpacing || 20,
    svgHeight,
    svgWidth,
    isFilled: line.fillColor !== undefined,
    alwaysStartFromZero: extraConfig.alwaysStartFromZero || false,
    curve: line.curve,
    calculateChartYAxisMinMax:
      extraConfig.calculateChartYAxisMinMax || undefined,
  });

  const isLineColorGradient = Array.isArray(line.lineColor);

  const getActivePointColor = useCallback(() => {
    if (line.activePointConfig?.color) {
      return line.activePointConfig.color;
    }
    if (!isLineColorGradient) {
      return line.lineColor as string;
    }
    return ACTIVE_POINT_CONFIG.color;
  }, [line?.activePointConfig?.color, line?.lineColor, isLineColorGradient]);

  return (
    <>
      <Defs>
        {!isLineColorGradient && (
          <LinearGradient id={identifier}>
            <Stop
              offset={extraConfig.rtl || false ? '100%' : '0%'}
              stopColor={backgroundColor || (line.lineColor as string)}
            />

            <Stop
              offset={extraConfig.rtl || false ? '90%' : '10%'}
              stopColor={line.lineColor as string}
            />
          </LinearGradient>
        )}

        {isLineColorGradient && (
          <LinearGradient
            id={identifier}
            gradientUnits="userSpaceOnUse"
            x1="300"
            y1="150"
            x2="0"
            y2="0"
          >
            <Stop
              offset="1"
              stopColor={(line.lineColor as string[])[0]}
              stopOpacity="1"
            />
            <Stop
              offset="0"
              stopColor={(line.lineColor as string[])[1]}
              stopOpacity="1"
            />
          </LinearGradient>
        )}
      </Defs>

      <Path
        strokeLinejoin="round"
        d={path.d || ''}
        stroke={`url(#${identifier})`}
        strokeWidth={line.lineWidth || 2}
        fill={line.fillColor !== undefined ? line.fillColor : 'transparent'}
        fillOpacity={0.5}
      />

      {line.endPointConfig && (
        <EndPoint
          x={path.x(line.data[line.data.length - 1]?.x as any)}
          y={path.y(line.data[line.data.length - 1]?.y as any)}
          color={line.endPointConfig?.color || END_POINT.color}
          animated={line.endPointConfig?.animated || END_POINT.animated}
          radius={line.endPointConfig?.radius || END_POINT.radius}
        />
      )}

      {line !== undefined && (
        <ActivePoint
          data={line.data}
          activeTouch={activeTouch}
          width={svgWidth}
          height={svgHeight}
          rtl={extraConfig.rtl || false}
          activePointComponent={line.activePointComponent}
          passSharedValueToActivePointComponent={
            line.passSharedValueToActivePointComponent
          }
          activeIndex={activeIndex}
          path={path}
          onPointChange={onPointChange}
          color={getActivePointColor()}
          borderColor={
            line?.activePointConfig?.borderColor ||
            ACTIVE_POINT_CONFIG.borderColor
          }
          showVerticalLine={
            line?.activePointConfig?.showVerticalLine ||
            ACTIVE_POINT_CONFIG.showVerticalLine
          }
          verticalLineColor={
            line?.activePointConfig?.verticalLineColor ||
            ACTIVE_POINT_CONFIG.verticalLineColor
          }
          verticalLineWidth={
            line?.activePointConfig?.verticalLineWidth ||
            ACTIVE_POINT_CONFIG.verticalLineWidth
          }
          verticalLineDashArray={
            line?.activePointConfig?.verticalLineDashArray ||
            ACTIVE_POINT_CONFIG.verticalLineDashArray
          }
          verticalLineOpacity={
            line?.activePointConfig?.verticalLineOpacity ||
            ACTIVE_POINT_CONFIG.verticalLineOpacity
          }
          radius={line?.activePointConfig?.radius || ACTIVE_POINT_CONFIG.radius}
        />
      )}
    </>
  );
};

export default SvgPath;
