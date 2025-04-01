import React, { useRef, useState } from 'react';
import MapView from 'react-native-maps';
import { HeadingProvider } from './context';

const useHeading = (mapRef) => {
  const [heading, setHeading] = useState(0);
  const handleSetHeading = () => {
    if (mapRef.current){
      mapRef.current.getCamera().then(camera => setHeading(camera.heading))
    }
  }
  return {mapRef, heading, handleSetHeading}
}

const MapViewWithHeading = ({children, onRegionChangeComplete, Component = MapView, ...mapViewProps}) => {
  const {mapRef, heading, handleSetHeading} = useHeading(mapViewProps.mapRef);
  const handleChange = (...args) => {
    if (typeof onRegionChangeComplete === 'function') {
      onRegionChangeComplete(...args);
    }
    handleSetHeading();
  }
  return (
    <HeadingProvider value={heading}>
      <Component {...mapViewProps} ref={mapRef} onRegionChangeComplete={handleChange}>
          {children}
      </Component>
    </HeadingProvider>
  )
}

export default MapViewWithHeading;