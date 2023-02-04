[React Native Simple Line Chart](../README.md) / [Exports](../modules.md) / Line

# Interface: Line

The line configuration object

## Table of contents

### Properties

- [activePointComponent](Line.md#activepointcomponent)
- [activePointComponentWithSharedValue](Line.md#activepointcomponentwithsharedvalue)
- [activePointConfig](Line.md#activepointconfig)
- [curve](Line.md#curve)
- [data](Line.md#data)
- [endPointConfig](Line.md#endpointconfig)
- [fillColor](Line.md#fillcolor)
- [lineColor](Line.md#linecolor)
- [lineWidth](Line.md#linewidth)

## Properties

### activePointComponent

• `Optional` **activePointComponent**: `ActivePointComponent`

The component to render when the user taps on the chart

#### Defined in

[src/types.ts:106](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L106)

___

### activePointComponentWithSharedValue

• `Optional` **activePointComponentWithSharedValue**: `ActivePointComponentSharedValue`

The same as (activePointComponent) but the component will receive the shared value of the active point (reanimated value) this can make the chart much more performant

#### Defined in

[src/types.ts:110](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L110)

___

### activePointConfig

• `Optional` **activePointConfig**: [`ActivePointConfig`](ActivePointConfig.md)

The configuration for the active point (the point that is shown when the user taps on the chart)

#### Defined in

[src/types.ts:94](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L94)

___

### curve

• `Optional` **curve**: `LineCurve`

The curve of the line

**`Default`**

'linear'

#### Defined in

[src/types.ts:123](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L123)

___

### data

• **data**: `DataPoint`<`any`\>[]

The data points for the line containing an array of objects with x and y values and optionally extraData

#### Defined in

[src/types.ts:90](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L90)

___

### endPointConfig

• `Optional` **endPointConfig**: [`EndPointConfig`](EndPointConfig.md)

The end point configuration (the point appearing at the end of the line)

#### Defined in

[src/types.ts:118](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L118)

___

### fillColor

• `Optional` **fillColor**: `ColorValue`

The color of the fill under the line (creates an area chart)

#### Defined in

[src/types.ts:102](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L102)

___

### lineColor

• `Optional` **lineColor**: `ColorValue` \| `ColorValue`[]

The color of the line (supplying an array of colors will create a linear gradient)

#### Defined in

[src/types.ts:98](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L98)

___

### lineWidth

• `Optional` **lineWidth**: `number`

The width of the line

#### Defined in

[src/types.ts:114](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/a945a45/src/types.ts#L114)
