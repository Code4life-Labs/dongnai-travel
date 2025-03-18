# React Native Maps Line Arrow

Add-on to react-native-maps to add arrow or any other component to the end of the Polyline component
Provides a workaround for [react-native-maps issue #3096](https://github.com/react-native-maps/react-native-maps/issues/3096)

Works both with **Expo-managed** and **bare** workflows.

## Installation

```
npm install react-native-map-maps-line-arrow react-native-maps --save
```

## Usage
Please refer to a working expo-managed app in /example folder.

1. Instead of built-in `<MapView>` and `<Polyline>` components from react-native-maps, use components from this package:
```js
import { MapViewWithHeading, ArrowedPolyline } from 'react-native-maps-line-arrow';
```
2. Use components the same way you would use `<MapView>` and `<Polyline>`:
```js
...
{/* don't use this code */}
{/* <MapView>
  <Polyline coordinates={COORDINATES} />
</MapView> */}

<MapViewWithHeading>
  <ArrowedPolyline coordinates={COORDINATES} />
</MapViewWithHeading>
...
```

## Props

### MapViewWithHeading
Inherits all the properties of `<MapView>`, as described [here](https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md).<br />
Has one own property, which is optional:
 - **Component**: ReactComponent<br />
_default: MapView (from react-native-maps)_<br />
Obviously, the passed component has to be able to render map, so passing a `<View>` will not work. However, when additional wrapper over react-native-maps is needed (e.g. react-map-clustering), it can be passed here. Please refer to an app in the /example folder.

### ArrowedPolyline
Inherits all the properties of `<Polyline>` component, as described [here](https://github.com/react-native-maps/react-native-maps/blob/master/docs/polyline.md).<br />
Has three own properties, all of them are optional:

 - **arrowSize**: number<br />
_default: 10_<br />
The size of an arrow pointer that will be used<br />

 - **addOnlyLastArrow**: boolean<br />
_default: false_<br />
By default, arrow pointers are drawn to all segments of the line. If set to _true_, the arrow pointer will be drawn only to the last segment of the polyline.<br />

 - **arrow**: function:ReactComponent<br />
_default: triangle composed of a `<View>` components_<br />
It is possible to use custom pointer. This should be a function returning React Component.<br />
Please note if you use a custom component: in the default state (when no rotation applied) the component should point to the top.<br />

## Examples
![examples](./example/assets/examples.png)
## Notes
1. Arrow is created by the `<Marker>` component, which is rotated to align with the line.
2. Calculation is based on spheric Earth form, which may result in slight angle aberration for some arrows which, however, should not be noticeable.
3. Arrows are drawn both for "geodesic" (shortest distance) and straight lines.


## Known Issue
When user manually rotates the map, arrows follow this rotation with a slight but visible delay. This is caused by the asynchronous nature of the getCamera method of `<MapView>` component. There is currently no remedy for this.