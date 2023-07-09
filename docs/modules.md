[React Native Simple Line Chart](README.md) / Exports

# React Native Simple Line Chart

## Table of contents

### Interfaces

- [ActivePointConfig](interfaces/ActivePointConfig.md)
- [AnimationConfig](interfaces/AnimationConfig.md)
- [EndPointConfig](interfaces/EndPointConfig.md)
- [ExtraConfig](interfaces/ExtraConfig.md)
- [Line](interfaces/Line.md)

### Type Aliases

- [LineChart](modules.md#linechart)

## Type Aliases

### LineChart

Ƭ **LineChart**: `Object`

The props for the LineChart component

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `activePointSharedValue?` | `DataPointSharedValue` | The shared value that will hold the active point (this is useful if you want to use the active point in other components) |
| `backgroundColor?` | `string` | The background color of the chart **`Default`** 'white' |
| `extraConfig?` | [`ExtraConfig`](interfaces/ExtraConfig.md) | More configuration for the chart |
| `height?` | `number` | The height of the chart **`Default`** 200 |
| `lines` | [`Line`](interfaces/Line.md)[] | The data for the chart **`Required`** at least one line is required |
| `onPointFocus?` | `onPointFocus` | This will run when the user taps on the a point on the chart |
| `onPointLoseFocus?` | `onPointLoseFocus` | This will run when the user release the tap on the a point on the chart |
| `width?` | `number` | The width of the chart (default value is the width of the screen) |

#### Defined in

[src/types.ts:7](https://github.com/Malaa-tech/react-native-simple-line-chart/blob/758c3af/src/types.ts#L7)
