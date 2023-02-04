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

[src/types.ts:72](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6f20241/src/types.ts#L72)

___

### activePointComponentWithSharedValue

• `Optional` **activePointComponentWithSharedValue**: `ActivePointComponentSharedValue`

The same as (activePointComponent) but the component will receive the shared value of the active point (reanimated value) this can make the chart much more performant

#### Defined in

[src/types.ts:76](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6f20241/src/types.ts#L76)

___

### activePointConfig

• `Optional` **activePointConfig**: [`ActivePointConfig`](ActivePointConfig.md)

The configuration for the active point (the point that is shown when the user taps on the chart)

#### Defined in

[src/types.ts:60](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6f20241/src/types.ts#L60)

___

### curve

• `Optional` **curve**: `LineCurve`

The curve of the line

**`Default`**

'linear'

#### Defined in

[src/types.ts:89](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6f20241/src/types.ts#L89)

___

### data

• **data**: `DataPoint`<`any`\>[]

The data points for the line containing an array of objects with x and y values and optionally extraData

#### Defined in

[src/types.ts:56](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6f20241/src/types.ts#L56)

___

### endPointConfig

• `Optional` **endPointConfig**: [`EndPointConfig`](EndPointConfig.md)

The end point configuration (the point appearing at the end of the line)

#### Defined in

[src/types.ts:84](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6f20241/src/types.ts#L84)

___

### fillColor

• `Optional` **fillColor**: `ColorValue`

The color of the fill under the line (creates an area chart)

#### Defined in

[src/types.ts:68](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6f20241/src/types.ts#L68)

___

### lineColor

• `Optional` **lineColor**: `ColorValue` \| `ColorValue`[]

The color of the line (supplying an array of colors will create a linear gradient)

#### Defined in

[src/types.ts:64](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6f20241/src/types.ts#L64)

___

### lineWidth

• `Optional` **lineWidth**: `number`

The width of the line

#### Defined in

[src/types.ts:80](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6f20241/src/types.ts#L80)
