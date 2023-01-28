/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
} from 'react-native-reanimated';
import { View } from 'react-native';
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import ActivePoint from './ActivePoint';
import EndPoint from './EndPoint';
import { createNewPath } from './utils';
import { DataPoint, ExtraConfig, Line } from './types';

const SvgPath = ({
  line1,
  line2,
  svgHeight,
  svgWidth,
  activeTouchX,
  activeTouch,
  backgroundColor,
  activeDataPoint,
  extraConfig,
}: {
  line1: Line;
  line2?: Line;
  svgHeight: number;
  svgWidth: number;
  activeTouchX: SharedValue<number>;
  activeTouch: SharedValue<boolean>;
  backgroundColor?: string;
  activeDataPoint: SharedValue<DataPoint | undefined>;
  extraConfig: ExtraConfig;
}) => {
  const allData = line1.data.concat(line2?.data || []);

  const activeIndex = useDerivedValue(() => {
    if (activeTouchX.value === 0 && extraConfig.initialActivePoint) {
      return extraConfig.initialActivePoint;
    }

    const percentage =
      (activeTouchX.value / (svgWidth - (extraConfig.endSpacing || 20))) * 100;

    const testInterpolation = interpolate(
      percentage,
      [0, 100],
      [0, line1.data.length - 1]
    );

    let activeIndexLocal = Math.round(testInterpolation);

    if (activeIndexLocal >= line1.data.length) {
      activeIndexLocal = line1.data.length - 1;
    }

    return activeIndexLocal;
  }, [activeTouchX, line1.data]);

  useAnimatedReaction(
    () => {
      return activeIndex.value;
    },
    () => {
      if (activeIndex?.value && activeTouch.value === true) {
        activeDataPoint.value = line1.data[activeIndex.value];
      }
    },
    [activeIndex, line1.data, activeTouch]
  );

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

      {line.endPoint && (
        <EndPoint
          x={path.x(line.data[line.data.length - 1]?.extraData?.date)}
          y={path.y(line.data[line.data.length - 1]?.value as any)}
          endPoint={line.endPoint}
        />
      )}

      {line.activePointConfig && (
        <ActivePoint
          data={line.data}
          activeTouch={activeTouch}
          width={svgWidth}
          height={svgHeight}
          activePoint={line.activePointConfig}
          rtl={extraConfig.rtl || false}
          activePointComponent={line.activePointComponent}
          passSharedValueToActivePointComponent={
            line.passSharedValueToActivePointComponent
          }
          activeIndex={activeIndex}
          path={path}
        />
      )}
    </>
  );
};

export default SvgPath;
