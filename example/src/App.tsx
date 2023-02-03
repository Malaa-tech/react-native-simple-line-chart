import moment from 'moment';
import * as React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Button,
  Switch,
  Platform,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LineChart from 'react-native-simple-line-chart';
import { DataPoint } from 'typings/react-native-simple-line-chart';

const generateData = ({
  numberOfPoints,
  range,
}: {
  numberOfPoints: number;
  range: number;
}) => {
  return [...Array(numberOfPoints).fill(undefined)].map((_v, index) => {
    const y = range + Math.round(Math.random() * 500);
    const x: number = moment()
      .subtract(numberOfPoints - index, 'hours')
      .toDate()
      .getTime();
    return {
      y,
      x,
      extraData: {
        formattedValue: `${y}$`,
        formattedTime: moment(x).fromNow(),
      },
    };
  });
};

export default function App() {
  const [data, setData] = React.useState(undefined);
  const [data2, setData2] = React.useState(undefined);
  const [numberOfPoints, setNumberOfPoints] = React.useState(30);
  const [color, setColor] = React.useState('pink');
  const [isLinearGradient, setIsLinearGradient] = React.useState(false);
  const [isEndPoint, setIsEndPoint] = React.useState(true);
  const [isAreaChart, setIsAreaChart] = React.useState(false);
  const [isMultipleLines, setIsMultipleLines] = React.useState(false);
  const [chartType, setChartType] = React.useState('monotone');

  React.useEffect(() => {
    setData(generateData({ numberOfPoints, range: 3000 }) as any);
    setData2(generateData({ numberOfPoints, range: 1500 }) as any);
  }, [numberOfPoints, isMultipleLines, isEndPoint]);

  if (!data) {
    return <></>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Chart
          data={data}
          data2={data2}
          isAreaChart={isAreaChart}
          color={color}
          isEndPoint={isEndPoint}
          isLinearGradient={isLinearGradient}
          isMultipleLines={isMultipleLines}
          chartType={chartType}
        />

        <View style={{ flexDirection: 'row', marginTop: 40 }}>
          <View style={{ marginHorizontal: 5 }}>
            <Button
              title="120 points"
              color={color}
              onPress={() => {
                setNumberOfPoints(90);
              }}
            />
          </View>
          <View style={{ marginHorizontal: 5 }}>
            <Button
              title="30 points"
              color={color}
              onPress={() => {
                setNumberOfPoints(30);
              }}
            />
          </View>
          <View style={{ marginHorizontal: 5 }}>
            <Button
              title="10 points"
              color={color}
              onPress={() => {
                setNumberOfPoints(10);
              }}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View style={{ marginHorizontal: 5 }}>
            <Button
              title="monotone"
              color={color}
              onPress={() => {
                setChartType('monotone');
              }}
            />
          </View>
          <View style={{ marginHorizontal: 5 }}>
            <Button
              title="step"
              color={color}
              onPress={() => {
                setChartType('step');
              }}
            />
          </View>
          <View style={{ marginHorizontal: 5 }}>
            <Button
              title="linear"
              color={color}
              onPress={() => {
                setChartType('linear');
              }}
            />
          </View>
        </View>

        {!isLinearGradient && (
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={{ marginHorizontal: 5 }}>
              <Button
                title="Coral"
                color={'coral'}
                onPress={() => {
                  setColor('coral');
                }}
              />
            </View>
            <View style={{ marginHorizontal: 5 }}>
              <Button
                title="Cyan"
                color={'darkcyan'}
                onPress={() => {
                  setColor('darkcyan');
                }}
              />
            </View>
            <View style={{ marginHorizontal: 5 }}>
              <Button
                title="Red"
                color={'indianred'}
                onPress={() => {
                  setColor('indianred');
                }}
              />
            </View>
            <View style={{ marginHorizontal: 5 }}>
              <Button
                title="Pink"
                color={'pink'}
                onPress={() => {
                  setColor('pink');
                }}
              />
            </View>
          </View>
        )}

        <View
          style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}
        >
          <Text style={{ marginRight: 10, color }}>Linear Gradient</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isLinearGradient ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setColor('#81b0ff');
              setIsLinearGradient(!isLinearGradient);
            }}
            value={isLinearGradient}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: Platform.select({ ios: 20, android: 5 }),
            alignItems: 'center',
          }}
        >
          <Text style={{ marginRight: 10, color }}>End Point</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'lightgreen' }}
            thumbColor={isEndPoint ? 'lightcyan' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              if (isEndPoint == false) {
                setIsAreaChart(false);
              }
              setIsEndPoint(!isEndPoint);
            }}
            value={isEndPoint}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: Platform.select({ ios: 20, android: 5 }),
            alignItems: 'center',
          }}
        >
          <Text style={{ marginRight: 10, color }}>Area Chart</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'lightgreen' }}
            thumbColor={isAreaChart ? 'lightcyan' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              if (isAreaChart == false) {
                setIsEndPoint(false);
              }
              setIsAreaChart(!isAreaChart);
            }}
            value={isAreaChart}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: Platform.select({ ios: 20, android: 5 }),
            alignItems: 'center',
          }}
        >
          <Text style={{ marginRight: 10, color }}>Multiple Lines</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'lightgreen' }}
            thumbColor={isMultipleLines ? 'lightcyan' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setIsMultipleLines(!isMultipleLines);
            }}
            value={isMultipleLines}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const Chart = ({
  data,
  data2,
  color,
  isLinearGradient,
  isAreaChart,
  isEndPoint,
  isMultipleLines,
  chartType,
}: any) => {
  const [activeDataPoint, setActiveDataPoint] = React.useState<
    number | undefined
  >(undefined);

  return (
    <>
      <Text
        style={{
          opacity: activeDataPoint === undefined ? 0 : 1,
          color: color,
          fontSize: 30,
          marginBottom: 20,
        }}
      >
        {activeDataPoint || ' '}
      </Text>
      <LineChart
        line1={{
          data,
          activePointConfig: {
            color,
            borderColor: 'black',
            radius: 4,
            showVerticalLine: true,
            verticalLineColor: 'gray',
            verticalLineOpacity: 0.7,
            verticalLineWidth: 1,
            verticalLineDashArray: [10, 5],
          },
          lineWidth: 4,
          lineColor: isLinearGradient ? ['#f5dd4b', '#81b0ff'] : color,
          fillColor: isAreaChart ? color : undefined,
          curve: chartType,
          endPointConfig: isEndPoint
            ? {
                color,
                radius: 5,
                animated: true,
              }
            : undefined,
          activePointComponent: (point: DataPoint | any) => {
            return (
              <View
                style={{
                  backgroundColor: color,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: 'white' }}>
                  {point?.extraData?.formattedValue}
                </Text>
                <Text style={{ color: 'white' }}>
                  {point?.extraData?.formattedTime}
                </Text>
              </View>
            );
          },
        }}
        line2={
          isMultipleLines
            ? {
                data: data2,
                activePointConfig: {
                  color,
                  borderColor: 'black',
                  radius: 4,
                  showVerticalLine: true,
                  verticalLineColor: 'gray',
                  verticalLineOpacity: 0.7,
                  verticalLineWidth: 1,
                  verticalLineDashArray: [10, 5],
                },
                lineWidth: 4,
                lineColor: isLinearGradient ? ['#f5dd4b', '#81b0ff'] : color,
                fillColor: isAreaChart ? color : undefined,
                endPointConfig: isEndPoint
                  ? {
                      color,
                      radius: 5,
                      animated: true,
                    }
                  : undefined,
                curve: chartType,
                activePointComponent: (point: DataPoint | any) => {
                  return (
                    <View
                      style={{
                        backgroundColor: color,
                        padding: 10,
                        borderRadius: 10,
                        marginTop: 10,
                      }}
                    >
                      <Text style={{ color: 'white' }}>
                        {point?.extraData?.formattedValue}
                      </Text>
                      <Text style={{ color: 'white' }}>
                        {point?.extraData?.formattedTime}
                      </Text>
                    </View>
                  );
                },
              }
            : undefined
        }
        extraConfig={{
          endSpacing: isEndPoint ? 20 : 0,
          alwaysShowActivePoint: false,
          alwaysStartFromZero: false,
          hideActivePointOnBlur: true,
          fadeStart: false,
          initialActivePoint: undefined,
          calculateChartYAxisMinMax: (min: number, max: number) => {
            return {
              min: min,
              max: max,
            };
          },
        }}
        onPointFocus={(point) => {
          setActiveDataPoint(point?.extraData?.formattedValue);
        }}
        onPointLoseFocus={() => {
          setActiveDataPoint(undefined);
        }}
        backgroundColor={undefined}
        height={200}
        width={Dimensions.get('screen').width}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
