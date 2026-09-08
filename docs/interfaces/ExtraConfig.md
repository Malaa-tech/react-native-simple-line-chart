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

[src/types.ts:253](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L253)

***

### alwaysShowActivePoint?

> `optional` **alwaysShowActivePoint**: `boolean`

Settings this to true will make the active point always visible rather than visible when pressing on the chart

#### Default

```ts
false
```

#### Defined in

[src/types.ts:232](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L232)

***

### alwaysStartYAxisFromZero?

> `optional` **alwaysStartYAxisFromZero**: `boolean`

Settings this to true will make the chart y axis start from zero even if the minimum value is greater than zero

#### Defined in

[src/types.ts:244](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L244)

***

### animationConfig?

> `optional` **animationConfig**: [`AnimationConfig`](AnimationConfig.md)

Animation configuration

#### Defined in

[src/types.ts:278](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L278)

***

### calculateChartXAxisMinMax?

> `optional` **calculateChartXAxisMinMax**: `calculateChartAxisMinMax`

supplying this function will allow you to customize the x axis min and max values

#### Defined in

[src/types.ts:274](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L274)

***

### calculateChartYAxisMinMax?

> `optional` **calculateChartYAxisMinMax**: `calculateChartAxisMinMax`

supplying this function will allow you to customize the y axis min and max values

#### Defined in

[src/types.ts:270](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L270)

***

### endSpacing?

> `optional` **endSpacing**: `number`

Space between the end of the chart the the end of the view (like paddingEnd)

#### Default

```ts
0
```

#### Defined in

[src/types.ts:258](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L258)

***

### hideActivePointOnBlur?

> `optional` **hideActivePointOnBlur**: `boolean`

Settings this to true will make the active point always visible after the user taps on the chart rather than hiding after pressOut

#### Defined in

[src/types.ts:240](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L240)

***

### initialActivePoint?

> `optional` **initialActivePoint**: `number`

This is the index of the initial active point (the point that will be active when the chart first renders), if you didn't set (alwaysShowActivePoint) to true then there is no reason to set this.

#### Defined in

[src/types.ts:236](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L236)

***

### maxTextureSize?

> `optional` **maxTextureSize**: `number`

Maximum Skia canvas texture size in physical pixels. Charts wider than
this (after PixelRatio scaling) are rasterized smaller and scaled up,
which reduces sharpness. Raise only for charts that need it — must not
exceed the device GPU's max texture size.

#### Default

```ts
4096
```

#### Defined in

[src/types.ts:266](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L266)

***

### simultaneousHandlers?

> `optional` **simultaneousHandlers**: `any`

Supplying simultaneousHandlers will make the chart work with other gesture handlers

#### Defined in

[src/types.ts:248](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/c7dd7c4763f2b17b1a0c91264b04b22f26923236/src/types.ts#L248)
