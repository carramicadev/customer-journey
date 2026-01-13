import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import "./MapComponent.css";

// Define types for props
export interface Coordinate {
  lat: number;
  lng: number;
}

interface MyComponentProps {
  setKoordinateReceiver: (coordinate: Coordinate) => void;
  koordinateReceiver: Coordinate;
  setErrors: (errors: Record<string, string>) => void;
  errors: Record<string, string>;
}

// Define Google Maps container style
const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px",
};

// Define the default center of the map
const center: Coordinate = {
  lat: -6.19715,
  lng: 106.699,
};

// Define libraries as a constant outside the component
const libraries: "places"[] = ["places"];

const MapComponent: React.FC<MyComponentProps> = ({
  setKoordinateReceiver,
  koordinateReceiver,
  setErrors,
  errors,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries, // Use the constant here
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<Coordinate | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarker({ lat, lng });
      setKoordinateReceiver({
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
      });
      setErrors({
        ...errors,
        koordinate: "",
      });
    }
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarker({ lat, lng });
        setKoordinateReceiver({
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
        });
        map?.panTo?.({ lat, lng });
      }
      setErrors({
        ...errors,
        koordinate: "",
      });
    }
  };

  return isLoaded ? (
    <>
      <label>Silahkan cari titik koordinat alamat anda!</label>
      <Autocomplete
        onLoad={(ref: google.maps.places.Autocomplete) => {
          autocompleteRef.current = ref;
        }}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          type="text"
          placeholder="Cari daerah anda"
          style={{ height: "40px", padding: "10px" }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
      {koordinateReceiver.lat && (
        <>
          <div className="input-note">latitude: {koordinateReceiver.lat}</div>
          <div style={{ marginBottom: "20px" }} className="input-note">
            longitude: {koordinateReceiver.lng}
          </div>
        </>
      )}
    </>
  ) : (
    <></>
  );
};

export default React.memo(MapComponent);
