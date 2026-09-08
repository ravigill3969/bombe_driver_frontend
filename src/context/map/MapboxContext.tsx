import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_ACCESS_TOKEN } from "@/global/env";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface MapboxContextValue {
  map: mapboxgl.Map | null;
  addContainer: (el: HTMLDivElement) => void;
  removeContainer: () => void;
  currentLocationCoords: { lat: number; lng: number } | undefined;
  setCoords: (lat: number, lng: number) => void;
  locationError: boolean;
  bringFocusOnMap: () => void;
}

const MapboxContext = createContext<MapboxContextValue | undefined>(undefined);

export function MapboxProvider({ children }: { children: ReactNode }) {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const mapContainerElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [currentLocationCoords, setCurrentLocationCoords] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    const holder = document.createElement("div");
    holder.style.position = "absolute";
    holder.style.width = "0";
    holder.style.height = "0";
    holder.style.overflow = "hidden";
    holder.style.visibility = "hidden";
    document.body.appendChild(holder);

    const containerEl = document.createElement("div");
    containerEl.style.width = "100%";
    containerEl.style.height = "100%";
    holder.appendChild(containerEl);

    const map = new mapboxgl.Map({
      style: "mapbox://styles/mapbox/dark-v11",
      container: containerEl,
      devtools: true,
      bounds: [
        [-141.00187, 41.675105],
        [-52.648099, 83.23324],
      ],
      zoom: 14,
    });

    map.on("style.load", () => {
      map.addControl(new mapboxgl.NavigationControl({ showCompass: true }));
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: true,
      showButton: false,
      followUserLocation: true,
      showUserLocation: true,
    });
    map.addControl(geolocate);
    geolocate.once("ready", () => {
      geolocate.trigger();
    });

    geolocate.on("geolocate", (pos) => {
      setLocationError(false);
      setCurrentLocationCoords({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });

    geolocate.on("error", () => {
      setLocationError(true);
    });

    holderRef.current = holder;
    mapContainerElRef.current = containerEl;
    mapRef.current = map;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMapInstance(map);

    return () => {
      map.remove();
      mapRef.current = null;
      holderRef.current = null;
      mapContainerElRef.current = null;
      holder.remove();
    };
  }, []);

  const addContainer = useCallback((el: HTMLDivElement) => {
    if (!mapContainerElRef.current || !mapRef.current) return;
    el.appendChild(mapContainerElRef.current);
    mapRef.current.resize();
  }, []);

  const removeContainer = useCallback(() => {
    if (!mapContainerElRef.current || !holderRef.current) return;
    holderRef.current.appendChild(mapContainerElRef.current);
  }, []);

  const setCoords = useCallback((newLat: number, newLng: number) => {
    setCurrentLocationCoords({ lat: newLat, lng: newLng });
  }, []);

  const bringFocusOnMap = useCallback(() => {
    mapContainerElRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <MapboxContext.Provider
      value={{
        map: mapInstance,
        addContainer,
        removeContainer,
        currentLocationCoords,
        setCoords,
        locationError,
        bringFocusOnMap,
      }}
    >
      {children}
    </MapboxContext.Provider>
  );
}

export function useMapboxContext() {
  const ctx = useContext(MapboxContext);
  if (!ctx) {
    throw new Error("useMapboxContext must be used within a MapboxProvider");
  }
  return ctx;
}
