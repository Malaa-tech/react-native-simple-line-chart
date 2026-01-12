[**React Native Simple Line Chart**](../README.md) • **Docs**

***

[React Native Simple Line Chart](../globals.md) / Line

# Interface: Line

The line configuration object

## Properties

### activePointComponent?

> `optional` **activePointComponent**: `ActivePointComponent`

The component to render when the user taps on the chart

#### Defined in

[src/types.ts:96](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L96)

***

### activePointComponentWithSharedValue?

> `optional` **activePointComponentWithSharedValue**: `ActivePointComponentSharedValue`

The same as (activePointComponent) but the component will receive the shared value of the active point (reanimated value) this can make the chart much more performant

#### Defined in

[src/types.ts:100](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L100)

***

### activePointConfig?

> `optional` **activePointConfig**: [`ActivePointConfig`](ActivePointConfig.md)

The configuration for the active point (the point that is shown when the user taps on the chart)

#### Defined in

[src/types.ts:67](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L67)

***

### curve?

> `optional` **curve**: `LineCurve`

The curve of the line

#### Default

```ts
'linear'
```

#### Defined in

[src/types.ts:113](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L113)

***

### data

> **data**: `DataPoint`\<`any`\>[]

The data points for the line containing an array of objects with x and y values and optionally extraData

#### Defined in

[src/types.ts:63](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L63)

***

### endPointConfig?

> `optional` **endPointConfig**: [`EndPointConfig`](EndPointConfig.md)

The end point configuration (the point appearing at the end of the line)

#### Defined in

[src/types.ts:108](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L108)

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

The fill opacity of the area chart

#### Default

```ts
1
```

#### Defined in

[src/types.ts:123](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L123)

***

### isAreaChart?

> `optional` **isAreaChart**: `boolean`

Toggle this to create an area chart, (it will take the same color as the lineColor)

#### Default

```ts
false
```

#### Defined in

[src/types.ts:118](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L118)

***

### key?

> `optional` **key**: `string`

Optional key to indicate that the line has changed (helps with triggering animations)

#### Defined in

[src/types.ts:59](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L59)

***

### leadingOpacity?

> `optional` **leadingOpacity**: `NumberProp` \| `object`

the opacity of the begging of the line (gives it gradient effect if you have colored background) (a percentage between 0 - 1)

#### Default

```ts
"1"
```

#### Defined in

[src/types.ts:76](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L76)

***

### lineColor?

> `optional` **lineColor**: `ColorValue` \| `ColorValue`[]

The color of the line (supplying an array of colors will create a linear gradient)

#### Defined in

[src/types.ts:71](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L71)

***

### lineWidth?

> `optional` **lineWidth**: `number`

The width of the line

#### Defined in

[src/types.ts:104](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L104)

***

### opacityDirection?

> `optional` **opacityDirection**: `"horizontal"` \| `"vertical"`

The direction of the opacity (horizontal or vertical)

#### Default

```ts
'horizontal'
```

#### Defined in

[src/types.ts:88](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L88)

***

### strokeDasharray?

> `optional` **strokeDasharray**: `NumberProp` \| readonly `NumberProp`[]

specify the strokeDasharray for the line

#### Defined in

[src/types.ts:92](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L92)

***

### trailingOpacity?

> `optional` **trailingOpacity**: `NumberProp` \| `object`

the opacity of the end of the line (gives it gradient effect if you have colored background) (a percentage between 0 - 1)

#### Default

```ts
"1"
```

#### Defined in

[src/types.ts:81](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/638977e1064b855904c85112815974f31c2777e9/src/types.ts#L81)
