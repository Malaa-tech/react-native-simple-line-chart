[React Native Simple Line Chart](../README.md) / [Exports](../modules.md) / ExtraConfig

# Interface: ExtraConfig

More configuration for the chart

## Table of contents

### Properties

- [activeOffsetX](ExtraConfig.md#activeoffsetx)
- [alwaysShowActivePoint](ExtraConfig.md#alwaysshowactivepoint)
- [alwaysStartYAxisFromZero](ExtraConfig.md#alwaysstartyaxisfromzero)
- [animationConfig](ExtraConfig.md#animationconfig)
- [calculateChartXAxisMinMax](ExtraConfig.md#calculatechartxaxisminmax)
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

[src/types.ts:220](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d9a44a4/src/types.ts#L220)

___

### alwaysShowActivePoint

• `Optional` **alwaysShowActivePoint**: `boolean`

Settings this to true will make the active point always visible rather than visible when pressing on the chart

**`Default`**

false

#### Defined in

[src/types.ts:199](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d9a44a4/src/types.ts#L199)

___

### alwaysStartYAxisFromZero

• `Optional` **alwaysStartYAxisFromZero**: `boolean`

Settings this to true will make the chart y axis start from zero even if the minimum value is greater than zero

#### Defined in

[src/types.ts:211](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d9a44a4/src/types.ts#L211)

___

### animationConfig

• `Optional` **animationConfig**: [`AnimationConfig`](AnimationConfig.md)

Animation configuration

#### Defined in

[src/types.ts:237](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d9a44a4/src/types.ts#L237)

___

### calculateChartXAxisMinMax

• `Optional` **calculateChartXAxisMinMax**: `calculateChartAxisMinMax`

supplying this function will allow you to customize the x axis min and max values

#### Defined in

[src/types.ts:233](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d9a44a4/src/types.ts#L233)

___

### calculateChartYAxisMinMax

• `Optional` **calculateChartYAxisMinMax**: `calculateChartAxisMinMax`

supplying this function will allow you to customize the y axis min and max values

#### Defined in

[src/types.ts:229](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d9a44a4/src/types.ts#L229)

___

### endSpacing

• `Optional` **endSpacing**: `number`

Space between the end of the chart the the end of the view (like paddingEnd)

**`Default`**

0

#### Defined in

[src/types.ts:225](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d9a44a4/src/types.ts#L225)

___

### hideActivePointOnBlur

• `Optional` **hideActivePointOnBlur**: `boolean`

Settings this to true will make the active point always visible after the user taps on the chart rather than hiding after pressOut

#### Defined in

[src/types.ts:207](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d9a44a4/src/types.ts#L207)

___

### initialActivePoint

• `Optional` **initialActivePoint**: `number`

This is the index of the initial active point (the point that will be active when the chart first renders), if you didn't set (alwaysShowActivePoint) to true then there is no reason to set this.

#### Defined in

[src/types.ts:203](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d9a44a4/src/types.ts#L203)

___

### simultaneousHandlers

• `Optional` **simultaneousHandlers**: `any`

Supplying simultaneousHandlers will make the chart work with other gesture handlers

#### Defined in

[src/types.ts:215](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/d9a44a4/src/types.ts#L215)
