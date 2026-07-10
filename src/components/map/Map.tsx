import { useEffect, useRef, useState } from "react";
// import useGetUserLiveLocation from "@/hooks/useGetUserLiveLocation";

import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

import { MAPBOX_ACCESS_TOKEN } from "@/global/env";
import useGetUserLiveLocation from "@/hooks/useGetUserLiveLocation";

function UberMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);

  const [emptyScreenMsg, setEmptyScreenMsg] = useState<string>("");

  const [lat, lng] = useGetUserLiveLocation();

  useEffect(() => {
    if (lat && lng) {
      setLongitude(lng);
      setLatitude(lat);
      setEmptyScreenMsg("")
    } else {
      setEmptyScreenMsg(
        "Please allow permssion for this site to access your location",
      );
      return;
    }

    mapRef.current = new mapboxgl.Map({
      accessToken: MAPBOX_ACCESS_TOKEN,
      style: "mapbox://styles/mapbox/standard",
      container: mapContainerRef.current!,
      center: [lng, lat],
      zoom: 14,
    });

    markerRef.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    markerRef.current.on("dragend", () => {
      if (!mapRef.current || !markerRef.current) return;

      const lngLat = markerRef.current.getLngLat();
      mapRef.current.flyTo({
        center: [lngLat.lng, lngLat.lat],
        essential: true,
      });
      setLatitude(lngLat.lat);
      setLongitude(lngLat.lng);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [lat, lng]);

  return (
    <div className="relative h-screen w-full">
      {emptyScreenMsg.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 text-lg font-semibold">
          {emptyScreenMsg}
        </div>
      )}
      <div
        className="h-screen w-full"
        id="map-container"
        ref={mapContainerRef}
      />
    </div>
  );
}

export default UberMap;
