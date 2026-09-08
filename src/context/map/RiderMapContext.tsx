import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import mapboxgl from "mapbox-gl";
import { KeepRouteInCenter } from "@/components/map/MapHelper/keepRouteInCenter";
import { MapboxProvider, useMapboxContext } from "@/context/map/MapboxContext";
import useReverseGeocoding from "@/hooks/useReverseGeocoding";
import {
  Routing_Profile,
  useUpdateRoute,
  type RouteMeta,
} from "@/hooks/useUpdateRoute";
import { MAPBOX_ACCESS_TOKEN } from "@/global/env";
import { useWebSocket } from "../WebsocketContext";
import  { useRiderInfoContext } from "../RiderInfoContext";

interface RiderMapContextValue {
  map: mapboxgl.Map | null;
  addContainer: (el: HTMLDivElement) => void;
  removeContainer: () => void;
  latitude: number;
  longitude: number;
  setCoords: (lat: number, lng: number) => void;
  emptyScreenMsg: string;
  markerMovementEnabled: boolean;
  makeMarkerMove: (val: boolean) => void;
  dropoff_coords: [number, number] | undefined;
  pickup_coords: [number, number] | undefined;
  setPickup_coords: (coords: [number, number] | undefined) => void;
  setDropoff_cords: (coords: [number, number] | undefined) => void;
  mapBoxFetchError: string;
  pickupLocationName: string;
  dropoffLocationName: string;
  PickupLocationNameFunc: (val: string) => void;
  DropoffLocationNameFunc: (val: string) => void;
  bringRouteToCenter: () => void;
  bringFocusOnMap: () => void;
  currentLocationCoords: { lat: number; lng: number } | undefined;
  ShowRidesWithFareFunc: (val: boolean) => void;
  showRidesWithFare: boolean;
  routeMeta: RouteMeta | undefined;
}

const RiderMapContext = createContext<RiderMapContextValue | undefined>(
  undefined,
);

function RiderMapProviderInner({ children }: { children: ReactNode }) {
  const {
    map,
    addContainer,
    removeContainer,
    currentLocationCoords,
    setCoords,
    bringFocusOnMap,
  } = useMapboxContext();

  const {
    rider: { setUserId },
  } = useWebSocket();
  const { isLoading, isVerified, riderInfo } = useRiderInfoContext();

  useEffect(() => {
    if (!isLoading && isVerified && riderInfo?.id) {
      setUserId(riderInfo.id);
    }
  }, [isLoading, isVerified, riderInfo?.id, setUserId]);

  const pickUpMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const dropOffMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const [markerMovementEnabled, setMarkerMovementEnabled] = useState(false);
  const [showRidesWithFare, setShowRidesWithFare] = useState(false);
  const [routeMeta, setRouteMeta] = useState<RouteMeta | undefined>(undefined);

  const [pickup_coords, setPickup_coords] = useState<
    [number, number] | undefined
  >(undefined);
  const [dropoff_coords, setDropoff_cords] = useState<
    [number, number] | undefined
  >(undefined);

  const [pickupLocationName, setPickupLocationName] = useState("");
  const [dropoffLocationName, setDropoffLocationName] = useState("");

  const { mapBoxFetchError, fetchRoute } = useUpdateRoute();

  const [isDragable] = useState(true);

  const { reverseGeocoding } = useReverseGeocoding();

  const latitude = 0;
  const longitude = 0;
  const emptyScreenMsg = "";

  // Pickup Marker Handler
  useEffect(() => {
    if (!map) return;

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: true,
      closeButton: false,
    }).setText("Move me to pick up location.");

    if (pickup_coords) {
      if (!pickUpMarkerRef.current) {
        const marker = new mapboxgl.Marker({
          color: "#22c55e",
          draggable: isDragable,
        })
          .setLngLat(pickup_coords)
          .addTo(map)
          .setPopup(popup)
          .togglePopup();

        marker.on("dragend", async () => {
          const pos = marker.getLngLat();
          const newCoords: [number, number] = [pos.lng, pos.lat];
          setPickup_coords(newCoords);
          map.flyTo({ center: newCoords, zoom: 15, essential: true });

          setShowRidesWithFare(false);

          const address = await reverseGeocoding(newCoords);
          if (address) setPickupLocationName(address);
        });

        pickUpMarkerRef.current = marker;
      } else {
        pickUpMarkerRef.current.setLngLat(pickup_coords);
      }
    } else if (pickUpMarkerRef.current) {
      pickUpMarkerRef.current.remove();
      pickUpMarkerRef.current = null;
    }
  }, [map, pickup_coords, isDragable, reverseGeocoding]);

  useEffect(() => {
    if (!map) return;

    // const popup = new mapboxgl.Popup({
    //   offset: 25,
    //   closeOnClick: true,
    //   closeButton: false,
    // }).setText("Move me to drop off location.");

    if (dropoff_coords) {
      if (!dropOffMarkerRef.current) {
        new mapboxgl.Marker({
          color: "#ef4444",
        })
          .setLngLat(dropoff_coords)
          .addTo(map)
          // .setPopup(popup)
          .togglePopup();

        // marker.on("dragend", async () => {
        //   const pos = marker.getLngLat();
        //   const newCoords: [number, number] = [pos.lng, pos.lat];
        //   setDropoff_cords(newCoords);
        //   map.flyTo({ center: newCoords, zoom: 15, essential: true });

        //   setShowRidesWithFare(false);

        //   const address = await reverseGeocoding(newCoords);
        //   if (address) setDropoffLocationName(address);
        // });

        //   dropOffMarkerRef.current = marker;
        // } else {
        //   dropOffMarkerRef.current.setLngLat(dropoff_coords);
      }
    } else if (dropOffMarkerRef.current) {
      dropOffMarkerRef.current.remove();
      dropOffMarkerRef.current = null;
    }
  }, [map, dropoff_coords, isDragable, reverseGeocoding]);

  useEffect(() => {
    let isMounted = true;

    async function updateRoute() {
      if (!pickup_coords || !dropoff_coords || !map) return;

      // 1. Fetch driving route
      const route = await fetchRoute(
        pickup_coords,
        dropoff_coords,
        MAPBOX_ACCESS_TOKEN,
        Routing_Profile.driving,
      );

      if (!isMounted || !route) {
        setRouteMeta(undefined);
        setShowRidesWithFare(false);
        return;
      }

      setRouteMeta(route);

      // Clean up driving route
      if (map.getLayer("route")) map.removeLayer("route");
      if (map.getSource("route")) map.removeSource("route");

      map.addSource("route", {
        type: "geojson",
        data: route.geometry,
      });

      map.addLayer({
        id: "route",
        source: "route",
        type: "line",
        paint: {
          "line-width": 5,
          "line-color": "red",
        },
      });
    }
    updateRoute();

    return () => {
      isMounted = false;
    };
  }, [dropoff_coords, pickup_coords, map, fetchRoute, currentLocationCoords]);

  const makeMarkerMove = (val: boolean) => {
    setMarkerMovementEnabled(val);
  };

  const bringRouteToCenter = () => {
    if (!map || !pickup_coords || !dropoff_coords) return;
    KeepRouteInCenter(pickup_coords, dropoff_coords, map);
  };

  function ShowRidesWithFareFunc(val: boolean) {
    setShowRidesWithFare(val);
  }

  function PickupLocationNameFunc(q: string) {
    setPickupLocationName(q);
  }

  function DropoffLocationNameFunc(q: string) {
    setDropoffLocationName(q);
  }

  return (
    <RiderMapContext.Provider
      value={{
        map,
        addContainer,
        removeContainer,
        makeMarkerMove,
        DropoffLocationNameFunc,
        PickupLocationNameFunc,
        latitude,
        longitude,
        setCoords,
        emptyScreenMsg,
        markerMovementEnabled,
        dropoff_coords,
        pickup_coords,
        setDropoff_cords,
        setPickup_coords,
        mapBoxFetchError,
        dropoffLocationName,
        pickupLocationName,
        bringRouteToCenter,
        bringFocusOnMap,
        currentLocationCoords,
        ShowRidesWithFareFunc,
        showRidesWithFare,
        routeMeta,
      }}
    >
      {children}
    </RiderMapContext.Provider>
  );
}

export function RiderMapProvider({ children }: { children: ReactNode }) {
  return (
    <MapboxProvider>
      <RiderMapProviderInner>{children}</RiderMapProviderInner>
    </MapboxProvider>
  );
}

export function useRiderMapContext() {
  const ctx = useContext(RiderMapContext);
  if (!ctx) {
    throw new Error(
      "useRiderMapContext must be used within a RiderMapProvider",
    );
  }
  return ctx;
}
