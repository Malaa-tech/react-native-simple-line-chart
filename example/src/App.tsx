import moment from 'moment';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LineChart from 'react-native-simple-line-chart';

export default function App() {
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <LineChart
          line1={{
            // workaround to show the chart with only one point
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
            endPoint: {
              animated: true,
              color: 'pink',
              radius: 6,
            },
            // curve: d3.curveMonotoneX,
            passSharedValueToActivePointComponent: true,
            // activePointComponent: (point: any) => {
            //     return (
            //         <ActivePoint
            //             point={point}
            //             theme={theme}
            //         />
            //     );
            // },
          }}
          extraConfig={{
            hideActivePointOnBlur: true,
            rtl: false,
            fadeStart: true,
            endSpacing: 30,
            alwaysShowActivePoint: false,
          }}
          backgroundColor={undefined}
          height={200}
          // activePointSharedValue={activePoint}
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
