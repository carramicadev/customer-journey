import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
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
  setCoordinate: (coordinate: Coordinate) => void;
  setAddress: (address: string) => void; // 🔥 TAMBAH
  coordinate: Coordinate;
  address: string;
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
  setCoordinate,
  setAddress,
  coordinate,
  address,
  setErrors,
  errors,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries, // Use the constant here
  });
  const [autoText, setAutoText] = useState("");
  useEffect(() => {
    if (address && address !== autoText) {
      setAutoText(address);
    }
  }, [address]);

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

      const pos = {
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
      };

      setMarker(pos);
      setCoordinate(pos);

      // 🔥 REVERSE GEOCODE DAN KIRIM KE PARENT
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: pos }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const formattedAddress = results[0].formatted_address;

          // 🔥 INI BARIS PALING PENTING
          setAddress(formattedAddress);
        }
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

        const pos = {
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
        };

        setMarker(pos);
        setCoordinate(pos);
        map?.panTo?.(pos);

        // 🔥 AMBIL ALAMAT DARI GOOGLE
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: pos }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const formattedAddress = results[0].formatted_address;

            // 🔥 KIRIM KE AddModalAddress
            setAddress(formattedAddress);
          }
        });
      }

      setErrors({
        ...errors,
        koordinate: "",
      });
    }
  };

  useEffect(() => {
    if (map && coordinate.lat && coordinate.lng) {
      const pos = { lat: coordinate.lat, lng: coordinate.lng };

      map.panTo(pos);
      map.setZoom(16);
      setMarker(pos);

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: pos }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const formatted = results[0].formatted_address;

          setAutoText(formatted); // isi input "Cari Alamat"
          setAddress(formatted); // isi formData.address
        }
      });
    }
  }, [coordinate.lat, coordinate.lng, map]);

  // 🔥 SINKRONISASI LANGSUNG DARI PARENT ADDRESS

  return isLoaded ? (
    <>
      <label>Pin Point Alamat</label>
      <p className="text-xs text-gray-400 ">
        Drag pin point untuk menentukan titik alamat
      </p>

      <Autocomplete
        onLoad={(ref: google.maps.places.Autocomplete) => {
          autocompleteRef.current = ref;
        }}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          value={autoText}
          onChange={(e) => setAutoText(e.target.value)}
          className="mb-2 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          type="text"
          placeholder="Cari Alamat"
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
    </>
  ) : (
    <></>
  );
};

export default React.memo(MapComponent);
