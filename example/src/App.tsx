import moment from 'moment';
import * as React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LineChart from 'react-native-simple-line-chart';

const exampleData = [...Array(30).fill(undefined)].map((v, index) => {
  const value = 3000 + Math.round(Math.random() * 500);
  const date = moment()
    .subtract(30 - index, 'hours')
    .toDate()
    .getTime();
  return {
    value,
    extraData: {
      date,
      formattedValue: value,
      formattedTime: moment(date).fromNow(),
    },
  };
});

export default function App() {
  const [activeDataPoint, setActiveDataPoint] = React.useState<
    undefined | number
  >(undefined);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <View style={styles.container}>
        <Text style={{ opacity: activeDataPoint === undefined ? 0 : 1, color: 'pink', fontSize: 20, marginBottom: 20 }}>{activeDataPoint || ' '}</Text>

        <LineChart
          line1={{
            data: exampleData,
            activePointConfig: {
              color: 'pink',
              borderColor: 'black',
              radius: 4,
              line: true,
              lineColor: 'gray',
              lineOpacity: 0.7,
              lineWidth: 1,
              lineDashArray: [10, 5],
              hideAfterActivePoint: true,
            },
            lineWidth: 4,
            lineColor: 'pink',
            fillColor: undefined,
            activePointComponent: (point) => {
              return (
                <View
                  style={{
                    backgroundColor: 'pink',
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
            }
          }}
          onPointFocus={(point) => {
            setActiveDataPoint(point?.value);
          }}
          onPointLoseFocus={() => {
            setActiveDataPoint(undefined);
          }}
          backgroundColor={undefined}
          height={200}
          width={Dimensions.get('screen').width}
        />
      </View>
    </GestureHandlerRootView>
  );
}

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
