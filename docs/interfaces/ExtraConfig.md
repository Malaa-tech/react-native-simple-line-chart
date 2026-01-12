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

[src/types.ts:257](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L257)

***

### alwaysShowActivePoint?

> `optional` **alwaysShowActivePoint**: `boolean`

Settings this to true will make the active point always visible rather than visible when pressing on the chart

#### Default

```ts
false
```

#### Defined in

[src/types.ts:236](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L236)

***

### alwaysStartYAxisFromZero?

> `optional` **alwaysStartYAxisFromZero**: `boolean`

Settings this to true will make the chart y axis start from zero even if the minimum value is greater than zero

#### Defined in

[src/types.ts:248](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L248)

***

### animationConfig?

> `optional` **animationConfig**: [`AnimationConfig`](AnimationConfig.md)

Animation configuration

#### Defined in

[src/types.ts:274](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L274)

***

### calculateChartXAxisMinMax?

> `optional` **calculateChartXAxisMinMax**: `calculateChartAxisMinMax`

supplying this function will allow you to customize the x axis min and max values

#### Defined in

[src/types.ts:270](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L270)

***

### calculateChartYAxisMinMax?

> `optional` **calculateChartYAxisMinMax**: `calculateChartAxisMinMax`

supplying this function will allow you to customize the y axis min and max values

#### Defined in

[src/types.ts:266](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L266)

***

### endSpacing?

> `optional` **endSpacing**: `number`

Space between the end of the chart the the end of the view (like paddingEnd)

#### Default

```ts
0
```

#### Defined in

[src/types.ts:262](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L262)

***

### hideActivePointOnBlur?

> `optional` **hideActivePointOnBlur**: `boolean`

Settings this to true will make the active point always visible after the user taps on the chart rather than hiding after pressOut

#### Defined in

[src/types.ts:244](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L244)

***

### initialActivePoint?

> `optional` **initialActivePoint**: `number`

This is the index of the initial active point (the point that will be active when the chart first renders), if you didn't set (alwaysShowActivePoint) to true then there is no reason to set this.

#### Defined in

[src/types.ts:240](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L240)

***

### simultaneousHandlers?

> `optional` **simultaneousHandlers**: `any`

Supplying simultaneousHandlers will make the chart work with other gesture handlers

#### Defined in

[src/types.ts:252](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L252)
