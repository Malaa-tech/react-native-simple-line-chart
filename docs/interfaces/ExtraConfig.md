[**React Native Simple Line Chart**](../README.md) • **Docs**

***

[React Native Simple Line Chart](../globals.md) / ExtraConfig

# Interface: ExtraConfig

More configuration for the chart

## Properties

### activeOffsetX?

> `optional` **activeOffsetX**: [`number`, `number`]

Supplying activeOffsetX for the gesture handler, if the offset is reached, the simultaneousHandlers will be disabled

#### Default

```ts
[0,0]
```

#### Defined in

[src/types.ts:220](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/1e608e6b6d295bb8e951ef279bc3801598fcb7fa/src/types.ts#L220)

***

### alwaysShowActivePoint?

> `optional` **alwaysShowActivePoint**: `boolean`

Settings this to true will make the active point always visible rather than visible when pressing on the chart

#### Default

```ts
false
```

#### Defined in

[src/types.ts:199](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/1e608e6b6d295bb8e951ef279bc3801598fcb7fa/src/types.ts#L199)

***

### alwaysStartYAxisFromZero?

> `optional` **alwaysStartYAxisFromZero**: `boolean`

Settings this to true will make the chart y axis start from zero even if the minimum value is greater than zero

#### Defined in

[src/types.ts:211](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/1e608e6b6d295bb8e951ef279bc3801598fcb7fa/src/types.ts#L211)

***

### animationConfig?

> `optional` **animationConfig**: [`AnimationConfig`](AnimationConfig.md)

Animation configuration

#### Defined in

[src/types.ts:237](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/1e608e6b6d295bb8e951ef279bc3801598fcb7fa/src/types.ts#L237)

***

### calculateChartXAxisMinMax?

> `optional` **calculateChartXAxisMinMax**: `calculateChartAxisMinMax`

supplying this function will allow you to customize the x axis min and max values

#### Defined in

[src/types.ts:233](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/1e608e6b6d295bb8e951ef279bc3801598fcb7fa/src/types.ts#L233)

***

### calculateChartYAxisMinMax?

> `optional` **calculateChartYAxisMinMax**: `calculateChartAxisMinMax`

supplying this function will allow you to customize the y axis min and max values

#### Defined in

[src/types.ts:229](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/1e608e6b6d295bb8e951ef279bc3801598fcb7fa/src/types.ts#L229)

***

### endSpacing?

> `optional` **endSpacing**: `number`

Space between the end of the chart the the end of the view (like paddingEnd)

#### Default

```ts
0
```

#### Defined in

[src/types.ts:225](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/1e608e6b6d295bb8e951ef279bc3801598fcb7fa/src/types.ts#L225)

***

### hideActivePointOnBlur?

> `optional` **hideActivePointOnBlur**: `boolean`

Settings this to true will make the active point always visible after the user taps on the chart rather than hiding after pressOut

#### Defined in

[src/types.ts:207](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/1e608e6b6d295bb8e951ef279bc3801598fcb7fa/src/types.ts#L207)

***

### initialActivePoint?

> `optional` **initialActivePoint**: `number`

This is the index of the initial active point (the point that will be active when the chart first renders), if you didn't set (alwaysShowActivePoint) to true then there is no reason to set this.

#### Defined in

[src/types.ts:203](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/1e608e6b6d295bb8e951ef279bc3801598fcb7fa/src/types.ts#L203)

***

### simultaneousHandlers?

> `optional` **simultaneousHandlers**: `any`

Supplying simultaneousHandlers will make the chart work with other gesture handlers

#### Defined in

[src/types.ts:215](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/1e608e6b6d295bb8e951ef279bc3801598fcb7fa/src/types.ts#L215)
