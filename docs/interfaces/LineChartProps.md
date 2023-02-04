[React Native Simple Line Chart](../README.md) / [Exports](../modules.md) / LineChartProps

# Interface: LineChartProps

The props for the LineChart component

## Table of contents

### Properties

- [activePointSharedValue](LineChartProps.md#activepointsharedvalue)
- [backgroundColor](LineChartProps.md#backgroundcolor)
- [extraConfig](LineChartProps.md#extraconfig)
- [height](LineChartProps.md#height)
- [line1](LineChartProps.md#line1)
- [line2](LineChartProps.md#line2)
- [onPointFocus](LineChartProps.md#onpointfocus)
- [onPointLoseFocus](LineChartProps.md#onpointlosefocus)
- [width](LineChartProps.md#width)

## Properties

### activePointSharedValue

• `Optional` **activePointSharedValue**: `DataPointSharedValue`<`any`\>

The shared value that will hold the active point (this is useful if you want to use the active point in other components)

#### Defined in

[src/types.ts:195](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L195)

___

### backgroundColor

• `Optional` **backgroundColor**: `string`

The background color of the chart

**`Default`**

'white'

#### Defined in

[src/types.ts:183](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L183)

___

### extraConfig

• `Optional` **extraConfig**: [`ExtraConfig`](ExtraConfig.md)

More configuration for the chart

#### Defined in

[src/types.ts:169](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L169)

___

### height

• `Optional` **height**: `number`

The height of the chart

**`Default`**

200

#### Defined in

[src/types.ts:174](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L174)

___

### line1

• **line1**: [`Line`](Line.md)

The line configuration object

**`Required`**

#### Defined in

[src/types.ts:200](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L200)

___

### line2

• `Optional` **line2**: [`Line`](Line.md)

Supply this if you want to create a multi line chart (note that the chart will only support two lines, and the two lines should have the same number of data points)

#### Defined in

[src/types.ts:204](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L204)

___

### onPointFocus

• `Optional` **onPointFocus**: `onPointFocus`

This will run when the user taps on the a point on the chart

#### Defined in

[src/types.ts:187](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L187)

___

### onPointLoseFocus

• `Optional` **onPointLoseFocus**: `onPointLoseFocus`

This will run when the user release the tap on the a point on the chart

#### Defined in

[src/types.ts:191](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L191)

___

### width

• `Optional` **width**: `number`

The width of the chart (default value is the width of the screen)

#### Defined in

[src/types.ts:178](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L178)
