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
- [key](Line.md#key)
- [lineColor](Line.md#linecolor)
- [lineWidth](Line.md#linewidth)
- [trailingOpacity](Line.md#trailingopacity)

## Properties

### activePointComponent

• `Optional` **activePointComponent**: `ActivePointComponent`

The component to render when the user taps on the chart

#### Defined in

[src/types.ts:78](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d8bd645/src/types.ts#L78)

___

### activePointComponentWithSharedValue

• `Optional` **activePointComponentWithSharedValue**: `ActivePointComponentSharedValue`

The same as (activePointComponent) but the component will receive the shared value of the active point (reanimated value) this can make the chart much more performant

#### Defined in

[src/types.ts:82](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d8bd645/src/types.ts#L82)

___

### activePointConfig

• `Optional` **activePointConfig**: [`ActivePointConfig`](ActivePointConfig.md)

The configuration for the active point (the point that is shown when the user taps on the chart)

#### Defined in

[src/types.ts:61](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d8bd645/src/types.ts#L61)

___

### curve

• `Optional` **curve**: `LineCurve`

The curve of the line

**`Default`**

'linear'

#### Defined in

[src/types.ts:95](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d8bd645/src/types.ts#L95)

___

### data

• **data**: `DataPoint`<`any`\>[]

The data points for the line containing an array of objects with x and y values and optionally extraData

#### Defined in

[src/types.ts:57](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d8bd645/src/types.ts#L57)

___

### endPointConfig

• `Optional` **endPointConfig**: [`EndPointConfig`](EndPointConfig.md)

The end point configuration (the point appearing at the end of the line)

#### Defined in

[src/types.ts:90](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d8bd645/src/types.ts#L90)

___

### fillColor

• `Optional` **fillColor**: `ColorValue`

The color of the fill under the line (creates an area chart)

#### Defined in

[src/types.ts:74](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d8bd645/src/types.ts#L74)

___

### key

• `Optional` **key**: `string`

Optional key to indicate that the line has changed (helps with triggering animations)

#### Defined in

[src/types.ts:53](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d8bd645/src/types.ts#L53)

___

### lineColor

• `Optional` **lineColor**: `ColorValue` \| `ColorValue`[]

The color of the line (supplying an array of colors will create a linear gradient)

#### Defined in

[src/types.ts:65](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d8bd645/src/types.ts#L65)

___

### lineWidth

• `Optional` **lineWidth**: `number`

The width of the line

#### Defined in

[src/types.ts:86](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d8bd645/src/types.ts#L86)

___

### trailingOpacity

• `Optional` **trailingOpacity**: `NumberProp`

the opacity of the begging of the line (gives it gradient effect if you have colored background) (a percentage between 0 - 1)

**`Default`**

"1"

#### Defined in

[src/types.ts:70](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d8bd645/src/types.ts#L70)
