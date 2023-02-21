/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect } from 'react';
import {
  interpolate,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import { View } from 'react-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import ActivePoint from './ActivePoint';
import EndPoint from './EndPoint';
import {
  createNewPath,
  getIndexOfTheNearestXPoint,
  PathObject,
  useForceReRender,
} from './utils';
import { DataPoint, ExtraConfig, Line } from './types';
import { ACTIVE_POINT_CONFIG, END_POINT } from './defaults';
import { AnimatedG, AnimatedPath } from './AnimatedComponents';
import useChartAnimation from './animations/animations';

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
              <MemoizedLineComponent
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

  const [localPath, setLocalPath] = React.useState<PathObject>();
  const forceRerender = useForceReRender();

  // forcing a re-render after x ms to fix sharedValues not causing a rerender.
  useEffect(() => {
    setTimeout(() => {
      forceRerender();
    }, 300);
  }, []);

  const {
    startAnimation,
    lineWrapperAnimatedStyle,
    lineAnimatedProps,
    endPointAnimation,
  } = useChartAnimation({
    duration: extraConfig.animationConfig?.duration || 0,
    animationType: extraConfig.animationConfig?.animationType || 'fade',
    path: localPath,
  });

  useEffect(() => {
    const path = createNewPath({
      data: line.data,
      allData,
      endSpacing: extraConfig.endSpacing || 20,
      svgHeight,
      svgWidth,
      isFilled: line.fillColor !== undefined,
      alwaysStartYAxisFromZero: extraConfig.alwaysStartYAxisFromZero || false,
      curve: line.curve,
      calculateChartYAxisMinMax:
        extraConfig.calculateChartYAxisMinMax || undefined,
    });

    if (extraConfig.animationConfig) {
      startAnimation({
        action: () => {
          setLocalPath(path);
        },
      });
    } else {
      setLocalPath(path);
    }
  }, [line.data.map((item) => item.y).join(''), line.curve, line.key, allData]);

  if (localPath === undefined) {
    return null;
  }

  return (
    <>
      <Defs>
        {!isLineColorGradient && (
          <LinearGradient id={identifier}>
            <Stop
              offset="100%"
              stopColor={backgroundColor || (line.lineColor as string)}
            />

            <Stop offset="90%" stopColor={line.lineColor as string} />
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

      <AnimatedG
        style={{
          ...lineWrapperAnimatedStyle,
        }}
      >
        <AnimatedPath
          strokeLinejoin="round"
          stroke={`url(#${identifier})`}
          strokeWidth={line.lineWidth || 2}
          fill={line.fillColor !== undefined ? line.fillColor : 'transparent'}
          fillOpacity={0.5}
          animatedProps={lineAnimatedProps}
        />

        {line.endPointConfig && (
          <EndPoint
            x={localPath.x(localPath.data[localPath.data.length - 1]?.x || 0)}
            y={localPath.y(localPath.data[localPath.data.length - 1]?.y || 0)}
            color={line.endPointConfig?.color || END_POINT.color}
            animated={line.endPointConfig?.animated || END_POINT.animated}
            radius={line.endPointConfig?.radius || END_POINT.radius}
            endPointAnimation={endPointAnimation}
          />
        )}
      </AnimatedG>

      {line !== undefined && line.activePointConfig !== undefined && (
        <ActivePoint
          data={localPath.data}
          activeTouch={activeTouch}
          width={svgWidth}
          height={svgHeight}
          activePointComponent={line.activePointComponent}
          activePointComponentWithSharedValue={
            line.activePointComponentWithSharedValue
          }
          activeIndex={activeIndex}
          path={localPath}
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

const MemoizedLineComponent = React.memo(LineComponent, (prev, next) => {
  return (
    prev.line.data.length === next.line.data.length &&
    prev.line.curve === next.line.curve &&
    prev.line.lineColor === next.line.lineColor &&
    prev.line.key === next.line.key &&
    prev.allData.map((item) => item.y).join('') ===
      next.allData.map((item) => item.y).join('')
  );
});

export default SvgPath;
