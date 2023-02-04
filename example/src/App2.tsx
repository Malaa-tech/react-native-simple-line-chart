import * as React from 'react';
import { View, Dimensions, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LineChart from 'react-native-simple-line-chart';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LineChart
          line1={{
            data: [
              {
                y: 10,
                x: new Date('2020-01-01').getTime(),
                extraData: {
                  formattedValue: '0',
                  formattedTime: '2020-01-01',
                },
              },
              {
                y: 20,
                x: new Date('2020-01-02').getTime(),
                extraData: {
                  formattedValue: '20',
                  formattedTime: '2020-01-02',
                },
              },
              {
                y: 15,
                x: new Date('2020-01-03').getTime(),
                extraData: {
                  date: new Date('2020-01-03').getTime(),
                  formattedValue: '15$',
                  formattedTime: '2020-01-03',
                },
              },
              {
                y: 35,
                x: new Date('2020-01-04').getTime(),
                extraData: {
                  formattedValue: '35$',
                  formattedTime: '2020-01-04',
                },
              },
              {
                y: 5,
                x: new Date('2020-01-06').getTime(),
                extraData: {
                  formattedValue: '35$',
                  formattedTime: '2020-01-04',
                },
              },
            ],
            activePointConfig: {
              color: 'black',
              showVerticalLine: true,
            },
            lineColor: 'pink',
            curve: 'linear',
            endPointConfig: {
              color: 'pink',
              radius: 5,
              animated: true,
            },
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
            },
          }}
          backgroundColor={undefined}
          height={200}
          width={Dimensions.get('screen').width}
        />
      </View>
    </GestureHandlerRootView>
  );
}
