import * as React from 'react';
import {View, Dimensions} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import LineChart from 'react-native-simple-line-chart';

export default function App() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <LineChart
                    lines={[
                        {
                            data: [
                                {
                                    y: 10,
                                    x: new Date('2019-12-30').getTime(),
                                    extraData: {
                                        formattedValue: '0',
                                        formattedTime: '2020-01-01',
                                    },
                                },
                                {
                                    y: 10,
                                    x: new Date('2020-01-01').getTime(),
                                    extraData: {
                                        formattedValue: '0',
                                        formattedTime: '2020-01-01',
                                    },
                                },
                                {
                                    y: 30,
                                    x: new Date('2020-01-02').getTime(),
                                    extraData: {
                                        formattedValue: '20',
                                        formattedTime: '2020-01-02',
                                    },
                                },
                            ],
                            leadingOpacity: {
                                opacity: 0,
                                leadingPercentage: 100,
                            },
                            lineColor: 'red',
                            curve: 'cardinal',
                        },
                        {
                            data: [
                                {
                                    y: 30,
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
                                    y: 5,
                                    x: new Date('2020-01-04').getTime(),
                                    extraData: {
                                        formattedValue: '35$',
                                        formattedTime: '2020-01-04',
                                    },
                                },
                                {
                                    y: 20,
                                    x: new Date('2020-01-06').getTime(),
                                    extraData: {
                                        formattedValue: '35$',
                                        formattedTime: '2020-01-04',
                                    },
                                },
                            ],
                            curve: 'step',
                            lineColor: 'blue',
                            leadingOpacity: 0,
                            trailingOpacity: 0.2,
                            isAreaChart: true,
                        },
                        {
                            data: [
                                {
                                    y: 20,
                                    x: new Date('2020-01-06').getTime(),
                                    extraData: {
                                        formattedValue: '35$',
                                        formattedTime: '2020-01-04',
                                    },
                                },
                                {
                                    y: 20,
                                    x: new Date('2020-01-07').getTime(),
                                    extraData: {
                                        formattedValue: '35$',
                                        formattedTime: '2020-01-04',
                                    },
                                },
                                {
                                    y: 20,
                                    x: new Date('2020-01-08').getTime(),
                                    extraData: {
                                        formattedValue: '35$',
                                        formattedTime: '2020-01-04',
                                    },
                                },
                            ],
                            strokeDasharray: [10, 10],
                            lineColor: '#0000FA',
                            curve: 'linear',
                            leadingOpacity: 0,
                        },
                        {
                            data: [
                                {
                                    y: 20,
                                    y2: 20,
                                    x: new Date('2020-01-06').getTime(),
                                    extraData: {
                                        formattedValue: '35$',
                                        formattedTime: '2020-01-04',
                                    },
                                },
                                {
                                    y: 25,
                                    y2: 10,
                                    x: new Date('2020-01-07').getTime(),
                                    extraData: {
                                        formattedValue: '35$',
                                        formattedTime: '2020-01-04',
                                    },
                                },
                                {
                                    y: 20,
                                    y2: 20,
                                    x: new Date('2020-01-08').getTime(),
                                    extraData: {
                                        formattedValue: '35$',
                                        formattedTime: '2020-01-04',
                                    },
                                },
                            ],
                            lineColor: '#0000FA',
                            lineWidth: 0,
                            curve: 'cardinal',
                            leadingOpacity: 0,
                            trailingOpacity: 0,
                        },
                    ]}
                    extraConfig={{
                        endSpacing: 0,
                    }}
                    backgroundColor={undefined}
                    height={200}
                    width={Dimensions.get('screen').width}
                />
            </View>
        </GestureHandlerRootView>
    );
}
