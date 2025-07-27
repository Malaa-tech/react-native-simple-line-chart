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

[src/types.ts:252](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6e0215dbd194df10ddb3d5a2a472fbe3c71a004f/src/types.ts#L252)

***

### alwaysShowActivePoint?

> `optional` **alwaysShowActivePoint**: `boolean`

Settings this to true will make the active point always visible rather than visible when pressing on the chart

#### Default

```ts
false
```

#### Defined in

[src/types.ts:231](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6e0215dbd194df10ddb3d5a2a472fbe3c71a004f/src/types.ts#L231)

***

### alwaysStartYAxisFromZero?

> `optional` **alwaysStartYAxisFromZero**: `boolean`

Settings this to true will make the chart y axis start from zero even if the minimum value is greater than zero

#### Defined in

[src/types.ts:243](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6e0215dbd194df10ddb3d5a2a472fbe3c71a004f/src/types.ts#L243)

***

### animationConfig?

> `optional` **animationConfig**: [`AnimationConfig`](AnimationConfig.md)

Animation configuration

#### Defined in

[src/types.ts:269](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6e0215dbd194df10ddb3d5a2a472fbe3c71a004f/src/types.ts#L269)

***

### calculateChartXAxisMinMax?

> `optional` **calculateChartXAxisMinMax**: `calculateChartAxisMinMax`

supplying this function will allow you to customize the x axis min and max values

#### Defined in

[src/types.ts:265](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6e0215dbd194df10ddb3d5a2a472fbe3c71a004f/src/types.ts#L265)

***

### calculateChartYAxisMinMax?

> `optional` **calculateChartYAxisMinMax**: `calculateChartAxisMinMax`

supplying this function will allow you to customize the y axis min and max values

#### Defined in

[src/types.ts:261](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6e0215dbd194df10ddb3d5a2a472fbe3c71a004f/src/types.ts#L261)

***

### endSpacing?

> `optional` **endSpacing**: `number`

Space between the end of the chart the the end of the view (like paddingEnd)

#### Default

```ts
0
```

#### Defined in

[src/types.ts:257](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6e0215dbd194df10ddb3d5a2a472fbe3c71a004f/src/types.ts#L257)

***

### hideActivePointOnBlur?

> `optional` **hideActivePointOnBlur**: `boolean`

Settings this to true will make the active point always visible after the user taps on the chart rather than hiding after pressOut

#### Defined in

[src/types.ts:239](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6e0215dbd194df10ddb3d5a2a472fbe3c71a004f/src/types.ts#L239)

***

### initialActivePoint?

> `optional` **initialActivePoint**: `number`

This is the index of the initial active point (the point that will be active when the chart first renders), if you didn't set (alwaysShowActivePoint) to true then there is no reason to set this.

#### Defined in

[src/types.ts:235](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6e0215dbd194df10ddb3d5a2a472fbe3c71a004f/src/types.ts#L235)

***

### simultaneousHandlers?

> `optional` **simultaneousHandlers**: `any`

Supplying simultaneousHandlers will make the chart work with other gesture handlers

#### Defined in

[src/types.ts:247](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/6e0215dbd194df10ddb3d5a2a472fbe3c71a004f/src/types.ts#L247)
