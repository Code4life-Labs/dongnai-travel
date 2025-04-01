declare module "react-native-maps-line-arrow" {
  import * as React from "react";
  import { MapPolylineProps, MapViewProps } from "react-native-maps";

  interface LineArrowProps {
    arrow?: (color: string, size: number) => React.ReactNode;
    addOnlyLastArrow?: boolean;
    arrowSize?: number;
  }

  export default class ArrowedPolyline extends React.Component<
    MapPolylineProps & LineArrowProps,
    any
  > {}

  interface MapViewWithHeadingProps {
    Component?: object,
  }

  class MapViewWithHeading extends React.Component<
    MapViewProps & MapViewWithHeadingProps,
    any
  >{}

  export {
    ArrowedPolyline,
    MapViewWithHeading
  }
}
