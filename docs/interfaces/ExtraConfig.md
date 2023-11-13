[React Native Simple Line Chart](../README.md) / [Exports](../modules.md) / ExtraConfig

# Interface: ExtraConfig

More configuration for the chart

## Table of contents

### Properties

- [activeOffsetX](ExtraConfig.md#activeoffsetx)
- [alwaysShowActivePoint](ExtraConfig.md#alwaysshowactivepoint)
- [alwaysStartYAxisFromZero](ExtraConfig.md#alwaysstartyaxisfromzero)
- [animationConfig](ExtraConfig.md#animationconfig)
- [calculateChartYAxisMinMax](ExtraConfig.md#calculatechartyaxisminmax)
- [endSpacing](ExtraConfig.md#endspacing)
- [hideActivePointOnBlur](ExtraConfig.md#hideactivepointonblur)
- [initialActivePoint](ExtraConfig.md#initialactivepoint)
- [simultaneousHandlers](ExtraConfig.md#simultaneoushandlers)

## Properties

### activeOffsetX

• `Optional` **activeOffsetX**: `number`[]

Supplying activeOffsetX for the gesture handler, if the offset is reached, the simultaneousHandlers will be disabled

**`Default`**

[0,0]

#### Defined in

[src/types.ts:210](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/b1965b6/src/types.ts#L210)

___

### alwaysShowActivePoint

• `Optional` **alwaysShowActivePoint**: `boolean`

Settings this to true will make the active point always visible rather than visible when pressing on the chart

**`Default`**

false

#### Defined in

[src/types.ts:189](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/b1965b6/src/types.ts#L189)

___

### alwaysStartYAxisFromZero

• `Optional` **alwaysStartYAxisFromZero**: `boolean`

Settings this to true will make the chart y axis start from zero even if the minimum value is greater than zero

#### Defined in

[src/types.ts:201](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/b1965b6/src/types.ts#L201)

___

### animationConfig

• `Optional` **animationConfig**: [`AnimationConfig`](AnimationConfig.md)

Animation configuration

#### Defined in

[src/types.ts:223](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/b1965b6/src/types.ts#L223)

___

### calculateChartYAxisMinMax

• `Optional` **calculateChartYAxisMinMax**: `calculateChartYAxisMinMax`

supplying this function will allow you to customize the y axis min and max values

#### Defined in

[src/types.ts:219](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/b1965b6/src/types.ts#L219)

___

### endSpacing

• `Optional` **endSpacing**: `number`

Space between the end of the chart the the end of the view (like paddingEnd)

**`Default`**

0

#### Defined in

[src/types.ts:215](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/b1965b6/src/types.ts#L215)

___

### hideActivePointOnBlur

• `Optional` **hideActivePointOnBlur**: `boolean`

Settings this to true will make the active point always visible after the user taps on the chart rather than hiding after pressOut

#### Defined in

[src/types.ts:197](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/b1965b6/src/types.ts#L197)

___

### initialActivePoint

• `Optional` **initialActivePoint**: `number`

This is the index of the initial active point (the point that will be active when the chart first renders), if you didn't set (alwaysShowActivePoint) to true then there is no reason to set this.

#### Defined in

[src/types.ts:193](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/b1965b6/src/types.ts#L193)

___

### simultaneousHandlers

• `Optional` **simultaneousHandlers**: `any`

Supplying simultaneousHandlers will make the chart work with other gesture handlers

#### Defined in

[src/types.ts:205](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/b1965b6/src/types.ts#L205)
