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
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import LineChart from 'react-native-simple-line-chart';
import {DataPoint, LineChartRef} from 'src/types';

const generateData = ({
    numberOfPoints,
    range,
}: {
    numberOfPoints: number;
    range: number;
}) => {
    return [...Array(numberOfPoints).fill(undefined)].map((_v, index) => {
        const y = range + Math.round(Math.random() * 1000);
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
    const [data3, setData3] = React.useState(undefined);
    const [data4, setData4] = React.useState(undefined);

    const [uniqueKey, setUniqueKey] = React.useState(Math.random());

    const [numberOfPoints, setNumberOfPoints] = React.useState(30);
    const [numberOfLines, setNumberOfLines] = React.useState(2);
    const [color, setColor] = React.useState('pink');
    const [isLinearGradient, setIsLinearGradient] = React.useState(false);
    const [isEndPoint, setIsEndPoint] = React.useState(true);
    const [isAreaChart, setIsAreaChart] = React.useState(false);
    const [chartType, setChartType] = React.useState('linear');
    const [isAnimationEnabled, setIsAnimationEnabled] = React.useState(true);

    const chartRef = React.useRef<LineChartRef>(null);

    const randomize = () => {
        setData(generateData({numberOfPoints, range: 3000}) as any);
        setData2(generateData({numberOfPoints, range: 1500}) as any);
        setData3(generateData({numberOfPoints, range: 2000}) as any);
        setData4(generateData({numberOfPoints, range: 1000}) as any);
    };

    React.useEffect(() => {
        randomize();
    }, [numberOfPoints, isEndPoint, numberOfLines, isAreaChart]);

    if (!data) {
        return <></>;
    }

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <View style={styles.container}>
                <Chart
                    key={uniqueKey}
                    data={data}
                    data2={data2}
                    data3={data3}
                    data4={data4}
                    numberOfLines={numberOfLines}
                    isAreaChart={isAreaChart}
                    color={color}
                    isEndPoint={isEndPoint}
                    isLinearGradient={isLinearGradient}
                    chartType={chartType}
                    isAnimationEnabled={isAnimationEnabled}
                    chartRef={chartRef}
                />

                <View style={{flexDirection: 'row', marginTop: 40}}>
                    <View style={{marginHorizontal: 5}}>
                        <Button
                            title="120 points"
                            color={color}
                            onPress={() => {
                                setNumberOfPoints(120);
                            }}
                        />
                    </View>
                    <View style={{marginHorizontal: 5}}>
                        <Button
                            title="30 points"
                            color={color}
                            onPress={() => {
                                setNumberOfPoints(30);
                            }}
                        />
                    </View>
                    <View style={{marginHorizontal: 5}}>
                        <Button
                            title="16 points"
                            color={color}
                            onPress={() => {
                                setNumberOfPoints(16);
                            }}
                        />
                    </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                    <View style={{marginHorizontal: 5}}>
                        <Button
                            title="1 Line"
                            color={color}
                            onPress={() => {
                                setNumberOfLines(1);
                            }}
                        />
                    </View>
                    <View style={{marginHorizontal: 5}}>
                        <Button
                            title="2 Lines"
                            color={color}
                            onPress={() => {
                                setNumberOfLines(2);
                            }}
                        />
                    </View>
                    <View style={{marginHorizontal: 5}}>
                        <Button
                            title="4 Lines"
                            color={color}
                            onPress={() => {
                                setNumberOfLines(4);
                            }}
                        />
                    </View>
                </View>

                {chartType === 'linear' && (
                    <View style={{flexDirection: 'row'}}>
                        <View style={{marginHorizontal: 5}}>
                            <Button
                                title="Toggle Animation"
                                color={color}
                                onPress={() => {
                                    if (isAnimationEnabled === false) {
                                        setIsAreaChart(false);
                                    }
                                    setIsAnimationEnabled(!isAnimationEnabled);
                                }}
                            />
                        </View>
                    </View>
                )}

                {!isAnimationEnabled && (
                    <View style={{flexDirection: 'row', marginTop: 0}}>
                        <View style={{marginHorizontal: 5}}>
                            <Button
                                title="monotone"
                                color={color}
                                onPress={() => {
                                    setChartType('monotone');
                                }}
                            />
                        </View>
                        <View style={{marginHorizontal: 5}}>
                            <Button
                                title="step"
                                color={color}
                                onPress={() => {
                                    setChartType('step');
                                }}
                            />
                        </View>
                        <View style={{marginHorizontal: 5}}>
                            <Button
                                title="linear"
                                color={color}
                                onPress={() => {
                                    setChartType('linear');
                                }}
                            />
                        </View>
                    </View>
                )}

                {!isLinearGradient && (
                    <View style={{flexDirection: 'row', marginTop: 0}}>
                        <View style={{marginHorizontal: 5}}>
                            <Button
                                title="Coral"
                                color="coral"
                                onPress={() => {
                                    setColor('coral');
                                }}
                            />
                        </View>
                        <View style={{marginHorizontal: 5}}>
                            <Button
                                title="Cyan"
                                color="darkcyan"
                                onPress={() => {
                                    setColor('darkcyan');
                                }}
                            />
                        </View>
                        <View style={{marginHorizontal: 5}}>
                            <Button
                                title="Red"
                                color="indianred"
                                onPress={() => {
                                    setColor('indianred');
                                }}
                            />
                        </View>
                        <View style={{marginHorizontal: 5}}>
                            <Button
                                title="Pink"
                                color="pink"
                                onPress={() => {
                                    setColor('pink');
                                }}
                            />
                        </View>
                    </View>
                )}

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{marginRight: 10, color}}>
                        Linear Gradient
                    </Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
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
                        marginTop: Platform.select({ios: 20, android: 5}),
                        alignItems: 'center',
                    }}
                >
                    <Text style={{marginRight: 10, color}}>End Point</Text>
                    <Switch
                        trackColor={{false: '#767577', true: 'lightgreen'}}
                        thumbColor={isEndPoint ? 'lightcyan' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {
                            if (isEndPoint === false) {
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
                        marginTop: Platform.select({ios: 20, android: 5}),
                        alignItems: 'center',
                    }}
                >
                    <Text style={{marginRight: 10, color}}>Area Chart</Text>
                    <Switch
                        trackColor={{false: '#767577', true: 'lightgreen'}}
                        thumbColor={isAreaChart ? 'lightcyan' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {
                            if (isAreaChart === false) {
                                setIsEndPoint(false);
                                setIsAnimationEnabled(false);
                            }
                            setIsAreaChart(!isAreaChart);
                        }}
                        value={isAreaChart}
                    />
                </View>
                <View style={{marginHorizontal: 5, marginTop: 10}}>
                    <Button
                        title="Randomize"
                        color={color}
                        onPress={() => {
                            randomize();
                        }}
                    />
                    <Button
                        title="Reset"
                        color={color}
                        onPress={() => {
                            setUniqueKey(Math.random());
                        }}
                    />
                </View>

                <View
                    style={{
                        marginHorizontal: 5,
                        marginTop: 10,
                        flexDirection: 'row',
                    }}
                >
                    <Button
                        title="Force Active 5"
                        color={color}
                        onPress={() => {
                            chartRef?.current?.setActiveIndex(5);
                        }}
                    />
                    <Button
                        title="Force Active 1"
                        color={color}
                        onPress={() => {
                            chartRef?.current?.setActiveIndex(1);
                        }}
                    />
                    <Button
                        title="Force Active undefined"
                        color={color}
                        onPress={() => {
                            chartRef?.current?.setActiveIndex(undefined);
                        }}
                    />
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const Chart = ({
    data,
    data2,
    data3,
    data4,
    color,
    isLinearGradient,
    isAreaChart,
    isEndPoint,
    isAnimationEnabled,
    numberOfLines,
    chartType,
    chartRef,
}: any) => {
    const [activeDataPoint, setActiveDataPoint] = React.useState<
        number | undefined
    >(undefined);

    return (
        <>
            <Text
                style={{
                    opacity: activeDataPoint === undefined ? 0 : 1,
                    color,
                    fontSize: 30,
                    marginBottom: 20,
                }}
            >
                {activeDataPoint || ' '}
            </Text>
            <LineChart
                ref={chartRef}
                key={isAnimationEnabled ? 'asdf' : '23333'}
                lines={[
                    {
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
                            animateTransition: true,
                        },
                        lineWidth: 4,
                        lineColor: isLinearGradient
                            ? ['#f5dd4b', '#81b0ff']
                            : color,
                        trailingOpacity: '0.3',
                        isAreaChart,
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
                                    <Text style={{color: 'white'}}>
                                        {point?.extraData?.formattedValue}
                                    </Text>
                                </View>
                            );
                        },
                    },
                    {
                        data: data4,
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
                        lineColor: isLinearGradient
                            ? ['#f5dd4b', '#81b0ff']
                            : color,
                        isAreaChart,
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
                                        marginTop: 10,
                                    }}
                                >
                                    <Text style={{color: 'white'}}>
                                        {point?.extraData?.formattedValue}
                                    </Text>
                                </View>
                            );
                        },
                    },
                    {
                        data: data3,
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
                        lineColor: isLinearGradient
                            ? ['#f5dd4b', '#81b0ff']
                            : color,
                        isAreaChart,
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
                                        marginTop: 10,
                                    }}
                                >
                                    <Text style={{color: 'white'}}>
                                        {point?.extraData?.formattedValue}
                                    </Text>
                                </View>
                            );
                        },
                    },
                    {
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
                        lineColor: isLinearGradient
                            ? ['#f5dd4b', '#81b0ff']
                            : color,
                        isAreaChart,
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
                                    <Text style={{color: 'white'}}>
                                        {point?.extraData?.formattedValue}
                                    </Text>
                                </View>
                            );
                        },
                    },
                ].slice(0, numberOfLines)}
                extraConfig={{
                    endSpacing: isEndPoint ? 20 : 0,
                    alwaysShowActivePoint: false,
                    alwaysStartYAxisFromZero: false,
                    hideActivePointOnBlur: true,
                    initialActivePoint: undefined,
                    animationConfig: isAnimationEnabled
                        ? {
                              animationType: 'transitionAttach',
                              duration: 1000,
                          }
                        : undefined,
                    calculateChartYAxisMinMax: (min: number, max: number) => {
                        return {
                            min,
                            max,
                        };
                    },
                }}
                onPointFocus={point => {
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
