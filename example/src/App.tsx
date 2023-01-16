import moment from 'moment';
import * as React from 'react';
import { StyleSheet, View, Dimensions, Text, Button, Switch } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LineChart from 'react-native-simple-line-chart';

const generateData = ({ numberOfPoints }: { numberOfPoints: number }) => {
  return [...Array(numberOfPoints).fill(undefined)].map((v, index) => {
    const value = 3000 + Math.round(Math.random() * 500);
    const date = moment()
      .subtract(numberOfPoints - index, 'hours')
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
  })
};

export default function App() {
  const [activeDataPoint, setActiveDataPoint] = React.useState<
    undefined | number
  >(undefined);
  const [data, setData] = React.useState(undefined);
  const [numberOfPoints, setNumberOfPoints] = React.useState(30);
  const [color, setColor] = React.useState('pink');
  const [isLinearGradient, setIsLinearGradient] = React.useState(false);
  const [isEndPoint, setIsEndPoint] = React.useState(true);

  React.useEffect(() => {
    setData(generateData({ numberOfPoints }) as any);
  }, [numberOfPoints]);

  if (!data) {
    return <></>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
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
              line: true,
              lineColor: 'gray',
              lineOpacity: 0.7,
              lineWidth: 1,
              lineDashArray: [10, 5],
              hideAfterActivePoint: true,
            },
            lineWidth: 4,
            lineColor: isLinearGradient ? ['#f5dd4b', '#81b0ff'] : color,
            fillColor: undefined,
            endPoint: isEndPoint ? {
              color,
              radius: 5,
              animated: true
            } : undefined,
            activePointComponent: (point) => {
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
          extraConfig={{
            endSpacing: isEndPoint ? 20 : 0,
            alwaysShowActivePoint: false,
            alwaysStartFromZero: false,
            hideActivePointOnBlur: true,
            fadeStart: false,
            initialActivePoint: undefined,
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

        <View style={{ flexDirection: 'row', marginTop: 40 }}>
          <View style={{ marginHorizontal: 5 }}>
            <Button title='120 points' color={color} onPress={() => {
              setNumberOfPoints(90);
            }} />
          </View>
          <View style={{ marginHorizontal: 5 }}>
            <Button title='30 points' color={color} onPress={() => {
              setNumberOfPoints(30);
            }} />
          </View>
          <View style={{ marginHorizontal: 5 }}>
            <Button title='10 points' color={color} onPress={() => {
              setNumberOfPoints(10);
            }} />
          </View>
        </View>


        {!isLinearGradient && (<View style={{ flexDirection: 'row', marginTop: 20 }}>
          <View style={{ marginHorizontal: 5 }}>
            <Button title='Coral' color={'coral'} onPress={() => {
              setColor('coral');
            }} />
          </View>
          <View style={{ marginHorizontal: 5 }}>
            <Button title='Cyan' color={'darkcyan'} onPress={() => {
              setColor('darkcyan');
            }} />
          </View>
          <View style={{ marginHorizontal: 5 }}>
            <Button title='Red' color={'indianred'} onPress={() => {
              setColor('indianred');
            }} />
          </View>
          <View style={{ marginHorizontal: 5 }}>
            <Button title='Pink' color={'pink'} onPress={() => {
              setColor('pink');
            }} />
          </View>
        </View>
        )}

        <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
          <Text style={{ marginRight: 10, color }}>Linear Gradient</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isLinearGradient ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setColor('#81b0ff')
              setIsLinearGradient(!isLinearGradient);
            }}
            value={isLinearGradient}
          />
        </View>

        <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
          <Text style={{ marginRight: 10, color }}>End Point</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'lightgreen' }}
            thumbColor={isEndPoint ? 'lightcyan' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setIsEndPoint(!isEndPoint);
            }}
            value={isEndPoint}
          />
        </View>

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
