![Cover](https://user-images.githubusercontent.com/24523985/118378101-ffdaeb80-b5d9-11eb-892f-38427ee34d75.jpg)

# React Native Weather Chart
`react-native-weather-chart` provides create weather chart with SVG. This library uses 
[`weather-icons`](https://github.com/erikflowers/weather-icons) as default.

[📲See example app](https://github.com/bk52/react-native-weather-chart-example)

## Installation
1) `npm i react-native-svg` install peer dependencies [More Info](https://github.com/react-native-svg/react-native-svg)
2) `npm i react-native-svg-transformer --save-dev` 
3) Configure the react native packager for [react-native-svg-transformer](https://github.com/kristerkari/react-native-svg-transformer)
#### For React Native v0.57 or newer
Merge the contents from your project's `metro.config.js` file with this config (create the file if it does not exist already).

```js
const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve("react-native-svg-transformer")
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"]
    }
  };
})();
```
4) `npm i react-native-weather-chart`

## Quick Example
```js
import React from 'react';
import {StyleSheet, View} from 'react-native';
import WeatherChart from 'react-native-weather-chart';

const Data = {
  values: [23, 24, 25, 20, 15],
  textBottom: ['23°', '24°', '25°', '20°', '15°'],
  iconBottom: ['DayCloudy', 'DaySunny', 'DaySunny', 'DayCloudy', 'DayRain'],
};

const Settings = {
  showTextTop: false,
  showTextBottom: true,
  showIconTop: false,
  showIconBottom: true,
};

const App = () => {
  return (
    <View style={styles.viewChart}>
      <WeatherChart data={Data} settings={Settings} />
    </View>
  );
};

const styles = StyleSheet.create({
  viewChart: {
    backgroundColor: '#212B34',
    margin: 10,
    height: 160,
  },
});

export default App;
```
## Properties
The component has two properties, `data` and `settings`  
```js
 <WeatherChart data={Data} settings={Settings} />
 ```
#### data
```js
const Data = {
  values: [23, 24, 25, 20, 15],
  textTop: ['Today', 'Mon', 'Tue', 'Wed', 'Thu'],
  iconTop: ['DayCloudy', 'DaySunny', 'DaySunny', 'DayCloudy', 'DayRain'],
  textBottom: ['23°', '24°', '25°', '20°', '15°'],
  iconBottom: ['DayCloudy', 'DaySunny', 'DaySunny', 'DayCloudy', 'DayRain'],
};
 ```
| Property   | Type          | Description                                                                                                                                                                       |
|------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| values     | Array[Number] | Required! If you dont have values, you should use empty array. []                                                                                                                 |
| textTop    | Array[String] | Optional.                                                                                                                                                                         |
| textBottom | Array[String] | Optional.                                                                                                                                                                         |
| iconTop    | Array[String] | This library uses [`weather-icons`](https://github.com/erikflowers/weather-icons) as default. You can find all icon names in [here](https://github.com/bk52/react-native-weather-chart/blob/main/src/WeatherChart/WeatherChartIcons.js). |
| iconBottom | Array[String] |  This library uses [`weather-icons`](https://github.com/erikflowers/weather-icons) as default. You can find all icon names in [here](https://github.com/bk52/react-native-weather-chart/blob/main/src/WeatherChart/WeatherChartIcons.js).                                                                                                                                                                                 |

#### settings
const Settings = {
  showTextTop: true,
  showTextBottom: false,
  showIconTop: true,
  showIconBottom: true,
  ...
};

| Property          | Type   | Description              | Default Value      |
|-------------------|--------|--------------------------|--------------------|
| colSpace          | Number | Space between two values | 100                |
| fontSizeTop       | Number | Font size of top text    | 12                 |
| fontSizeBottom    | Number | Font size of bottom text | 12                 |
| iconSize          | Number | Size of all icons        | 30                 |
| marginTop         | Number |                          | 0                  |
| marginLeft        | Number |                          | 30                 |
| marginRight       | Number |                          | 30                 |
| markerSize        | Number |                          | 4                  |
| markerStrokeSize  | Number |                          | 1.5                |
| showTextTop       | Bool   |                          | true               |
| showTextBottom    | Bool   |                          | true               |
| showIconTop       | Bool   |                          | true               |
| showIconBottom    | Bool   |                          | true               |
| showVerticalLines | Bool   |                          | true               |
| lineColor         | String |                          | 'lightgray'        |
| vlineColor        | String |                          | 'lightgray'        |
| vlineStroke       | String |                          | '5,5'              |
| topTextColor      | String |                          | '#A6BCD0'          |
| bottomTextColor   | String |                          | '#A6BCD0'          |
| markerFillColor   | String |                          | 'white'            |
| markerStrokeColor | String |                          | 'lightgray'        |
| noDataText        | String |                          | 'There is no data' |
| noDataTextColor   | String |                          | '#A6BCD0'          |
| noDataFontSize    | Number |                          | 12                 |
| iconTopColor      | String |                          | '#fff'             |
| iconBottomColor   | String |                          | '#fff'             |
|                   |        |                          |                    |
