[![License](http://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/Malaa-tech/react-native-simple-line-chart)

# React Native Simple Line Chart
A simple/interactive/fast line chart component for React Native using d3, react-native-svg, react-native-gesture-handler and react-native-reanimated.

### 🦄 Features
- ✅  Supports RTL languages   
- ✅  Customizable active point component  
- ✅  Linear gradient line color  
- ✅  Supports different curve types  
- ✅  Full utilization of reanimated and shared values  
- ✅  Supports area chart presentation   

 
### How we use it in Malaa App
<p align="center">
  <img width="300" alt="Screenshot 2023-02-02 at 12 47 07 AM" src="https://user-images.githubusercontent.com/24798045/216170753-6d2a71fb-866e-48f9-83b1-2a9f1404753b.png">
  <img width="300" alt="Screenshot 2023-02-02 at 12 46 55 AM" src="https://user-images.githubusercontent.com/24798045/216170756-fa446ccb-f97b-4524-a19e-5e10f7a2561b.png">
  <img width="300" alt="Screenshot 2023-02-02 at 12 45 47 AM" src="https://user-images.githubusercontent.com/24798045/216170758-8513ad23-9803-4fea-9e50-434f93a54965.png">
</p>

### 🔮 Example App Demo
- run it your self using ```yarn example [ios/andriod]``` or watch this [Video](https://user-images.githubusercontent.com/24798045/216169227-8044461f-9d2d-4990-b3aa-c15e2b3464e2.mp4)

## 📦 Installation
```bash | pure
npm install react-native-simple-line-chart
```
or
```bash | pure
yarn add react-native-simple-line-chart
```
⚠️ Make sure you have [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) + [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/) + [react-native-svg](https://github.com/software-mansion/react-native-svg) installed in your project.


## ⚒️ Usage
```tsx | pure
import LineChart, { DataPoint } from 'react-native-simple-line-chart';

<LineChart
  line1={{
    data: [
      {
        y: 0,
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
    activePointComponent: (point: DataPoint | any) => {
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
```
