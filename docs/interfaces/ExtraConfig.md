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

[src/types.ts:204](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/128ca3b/src/types.ts#L204)

___

### alwaysShowActivePoint

• `Optional` **alwaysShowActivePoint**: `boolean`

Settings this to true will make the active point always visible rather than visible when pressing on the chart

**`Default`**

false

#### Defined in

[src/types.ts:183](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/128ca3b/src/types.ts#L183)

___

### alwaysStartYAxisFromZero

• `Optional` **alwaysStartYAxisFromZero**: `boolean`

Settings this to true will make the chart y axis start from zero even if the minimum value is greater than zero

#### Defined in

[src/types.ts:195](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/128ca3b/src/types.ts#L195)

___

### animationConfig

• `Optional` **animationConfig**: [`AnimationConfig`](AnimationConfig.md)

Animation configuration

#### Defined in

[src/types.ts:217](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/128ca3b/src/types.ts#L217)

___

### calculateChartYAxisMinMax

• `Optional` **calculateChartYAxisMinMax**: `calculateChartYAxisMinMax`

supplying this function will allow you to customize the y axis min and max values

#### Defined in

[src/types.ts:213](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/128ca3b/src/types.ts#L213)

___

### endSpacing

• `Optional` **endSpacing**: `number`

Space between the end of the chart the the end of the view (like paddingEnd)

**`Default`**

0

#### Defined in

[src/types.ts:209](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/128ca3b/src/types.ts#L209)

___

### hideActivePointOnBlur

• `Optional` **hideActivePointOnBlur**: `boolean`

Settings this to true will make the active point always visible after the user taps on the chart rather than hiding after pressOut

#### Defined in

[src/types.ts:191](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/128ca3b/src/types.ts#L191)

___

### initialActivePoint

• `Optional` **initialActivePoint**: `number`

This is the index of the initial active point (the point that will be active when the chart first renders), if you didn't set (alwaysShowActivePoint) to true then there is no reason to set this.

#### Defined in

[src/types.ts:187](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/128ca3b/src/types.ts#L187)

___

### simultaneousHandlers

• `Optional` **simultaneousHandlers**: `any`

Supplying simultaneousHandlers will make the chart work with other gesture handlers

#### Defined in

[src/types.ts:199](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/128ca3b/src/types.ts#L199)
