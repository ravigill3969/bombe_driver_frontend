import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import useGetUserLiveLocation from "@/hooks/useGetUserLiveLocation";
import type { Marker as LeafletMarker } from "leaflet";

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
}

function UberMap() {
  const liveCoords = useGetUserLiveLocation();

  const markerRef = useRef<LeafletMarker>(null);

  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

  useEffect(() => {
    if (liveCoords && liveCoords[0] != null && liveCoords[1] != null) {
      setLatitude(liveCoords[0]);
      setLongitude(liveCoords[1]);
    }
  }, [liveCoords]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();

          setLatitude(latLng.lat);
          setLongitude(latLng.lng);

          console.log("New coordinates after drag:", latLng.lat, latLng.lng);
        }
      },
    }),
    [],
  );

  if (latitude === undefined || longitude === undefined) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading map or waiting for location permissions...
      </div>
    );
  }

  const centerPosition: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={centerPosition}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <RecenterMap center={centerPosition} />

      <Marker
        position={centerPosition}
        draggable={true}
        eventHandlers={eventHandlers}
        ref={markerRef}
      >
        <Popup>You are here</Popup>
      </Marker>
    </MapContainer>
  );
}

export default UberMap;
