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

[src/types.ts:92](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L92)

***

### activePointComponentWithSharedValue?

> `optional` **activePointComponentWithSharedValue**: `ActivePointComponentSharedValue`

The same as (activePointComponent) but the component will receive the shared value of the active point (reanimated value) this can make the chart much more performant

#### Defined in

[src/types.ts:96](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L96)

***

### activePointConfig?

> `optional` **activePointConfig**: [`ActivePointConfig`](ActivePointConfig.md)

The configuration for the active point (the point that is shown when the user taps on the chart)

#### Defined in

[src/types.ts:65](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L65)

***

### curve?

> `optional` **curve**: `LineCurve`

The curve of the line

#### Default

```ts
'linear'
```

#### Defined in

[src/types.ts:109](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L109)

***

### data

> **data**: `DataPoint`\<`any`\>[]

The data points for the line containing an array of objects with x and y values and optionally extraData

#### Defined in

[src/types.ts:61](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L61)

***

### endPointConfig?

> `optional` **endPointConfig**: [`EndPointConfig`](EndPointConfig.md)

The end point configuration (the point appearing at the end of the line)

#### Defined in

[src/types.ts:104](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L104)

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

The fill opacity of the area chart

#### Default

```ts
1
```

#### Defined in

[src/types.ts:119](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L119)

***

### isAreaChart?

> `optional` **isAreaChart**: `boolean`

Toggle this to create an area chart, (it will take the same color as the lineColor)

#### Default

```ts
false
```

#### Defined in

[src/types.ts:114](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L114)

***

### key?

> `optional` **key**: `string`

Optional key to indicate that the line has changed (helps with triggering animations)

#### Defined in

[src/types.ts:57](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L57)

***

### leadingOpacity?

> `optional` **leadingOpacity**: `number` \| `object`

the opacity of the begging of the line (gives it gradient effect if you have colored background) (a percentage between 0 - 1)

#### Default

```ts
"1"
```

#### Defined in

[src/types.ts:74](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L74)

***

### lineColor?

> `optional` **lineColor**: `ColorValue` \| `ColorValue`[]

The color of the line (supplying an array of colors will create a linear gradient)

#### Defined in

[src/types.ts:69](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L69)

***

### lineWidth?

> `optional` **lineWidth**: `number`

The width of the line

#### Defined in

[src/types.ts:100](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L100)

***

### opacityDirection?

> `optional` **opacityDirection**: `"horizontal"` \| `"vertical"`

The direction of the opacity (horizontal or vertical)

#### Default

```ts
'horizontal'
```

#### Defined in

[src/types.ts:84](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L84)

***

### strokeDasharray?

> `optional` **strokeDasharray**: `number`[]

specify the strokeDasharray for the line

#### Defined in

[src/types.ts:88](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L88)

***

### trailingOpacity?

> `optional` **trailingOpacity**: `number` \| `object`

the opacity of the end of the line (gives it gradient effect if you have colored background) (a percentage between 0 - 1)

#### Default

```ts
"1"
```

#### Defined in

[src/types.ts:79](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L79)
