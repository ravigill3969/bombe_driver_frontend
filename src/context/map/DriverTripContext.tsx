import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useMapboxContext } from "./MapboxContext";
import mapboxgl from "mapbox-gl";
import { useLocation, useNavigate } from "react-router";
import { Routing_Profile, useUpdateRoute } from "@/hooks/useUpdateRoute";
import { MAPBOX_ACCESS_TOKEN } from "@/global/env";
import type { ActiveTripResponse } from "@/API/trip/trip_types";
import { useDriverMapContext } from "./DriverMapContext";
import {
  useCancelTripWithDriverId,
  useCompletedTrip,
} from "@/API/trip/trip_apis";
import { useDriverInfoContext } from "../DriverInfoContext";

interface TripContextType {
  isPending: boolean;
  hasActiveTrip: boolean;
  isDriverNearPickup: boolean;
  isDriverNearDropoff: boolean;
  rider_id: string;
  trip_id: string;
  cancel_trip: () => void;
  complete_trip: () => void;
}

function getCoordinates(
  data: ActiveTripResponse | undefined | null,
  type: "pickup" | "dropoff",
): [number, number] | undefined {
  if (!data) return undefined;

  const location = type === "pickup" ? data.pickup : data.dropoff;

  return [location.longitude, location.latitude];
}

const TripContext = createContext<TripContextType | null>(null);

function DriverTripContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate: tripCancelDriver } = useCancelTripWithDriverId();
  const { mutate: completeTripMutate } = useCompletedTrip();
  const { driverInfo } = useDriverInfoContext();

  const { fetchRoute } = useUpdateRoute();
  const { map, currentLocationCoords } = useMapboxContext();
  const {
    hasActiveTrip,
    isAvtiveTripFetchPending: isPending,
    tripData: data,
  } = useDriverMapContext();

  const pickupLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const distanceMeters = useCallback(
    (lat1: number, lng1: number, lat2: number, lng2: number): number => {
      const earthRadius = 6371000;

      const lat1Rad = (lat1 * Math.PI) / 180;
      const lat2Rad = (lat2 * Math.PI) / 180;

      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLng / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return earthRadius * c;
    },
    [],
  );

  useEffect(() => {
    if (!isPending && !data && location.pathname === "/driver/active-trip") {
      navigate("/driver");
    }
  }, [isPending, data, navigate, location.pathname]);

  // Set pickup/dropoff when trip changes
  const pickup_coords = useMemo(() => getCoordinates(data, "pickup"), [data]);

  const dropoff_coords = useMemo(() => getCoordinates(data, "dropoff"), [data]);

  // Trip status
  const tripStatus = data?.rideDetails.status;

  const routeDestination =
    tripStatus === "picked" ? dropoff_coords : pickup_coords;

  // Pickup marker
  useEffect(() => {
    if (!map) return;

    if (!pickup_coords) {
      pickupLocationMarkerRef.current?.remove();
      pickupLocationMarkerRef.current = null;
      return;
    }

    if (!pickupLocationMarkerRef.current) {
      pickupLocationMarkerRef.current = new mapboxgl.Marker({
        color: "#3b82f6",
      })
        .setLngLat(pickup_coords)
        .addTo(map);
    } else {
      pickupLocationMarkerRef.current.setLngLat(pickup_coords);
    }
  }, [map, pickup_coords]);

  // Dropoff marker
  useEffect(() => {
    if (!map) return;

    if (!dropoff_coords) {
      destLocationMarkerRef.current?.remove();
      destLocationMarkerRef.current = null;
      return;
    }

    if (!destLocationMarkerRef.current) {
      destLocationMarkerRef.current = new mapboxgl.Marker({
        color: "#ef4444",
      })
        .setLngLat(dropoff_coords)
        .addTo(map);
    } else {
      destLocationMarkerRef.current.setLngLat(dropoff_coords);
    }
  }, [map, dropoff_coords]);

  // Route
  useEffect(() => {
    if (!map) return;

    const clearRoute = () => {
      if (map.getLayer("route")) {
        map.removeLayer("route");
      }

      if (map.getSource("route")) {
        map.removeSource("route");
      }
    };

    if (!currentLocationCoords || !routeDestination) {
      clearRoute();
      return;
    }

    const origin: [number, number] = [
      currentLocationCoords.lng,
      currentLocationCoords.lat,
    ];

    const destination = routeDestination;

    let cancelled = false;

    const updateRoute = async () => {
      const route = await fetchRoute(
        origin,
        destination,
        MAPBOX_ACCESS_TOKEN,
        Routing_Profile.driving,
      );

      if (!route || cancelled) return;

      clearRoute();

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
    };

    updateRoute();

    return () => {
      cancelled = true;
    };
  }, [map, currentLocationCoords, routeDestination, fetchRoute]);

  // Check driver distance from destination
  const isDriverNearPickup = useMemo(() => {
    if (!currentLocationCoords) return false;
    if (tripStatus !== "assigned" || !pickup_coords) return false;

    const meters = distanceMeters(
      currentLocationCoords.lat,
      currentLocationCoords.lng,
      pickup_coords[1],
      pickup_coords[0],
    );

    return meters < 1000;
  }, [currentLocationCoords, tripStatus, pickup_coords, distanceMeters]);

  const isDriverNearDropoff = useMemo(() => {
    if (!currentLocationCoords) return false;
    if (tripStatus !== "picked" || !dropoff_coords) return false;

    const meters = distanceMeters(
      currentLocationCoords.lat,
      currentLocationCoords.lng,
      dropoff_coords[1],
      dropoff_coords[0],
    );

    console.log("Distance to dropoff:", meters, "meters");

    return meters < 1000;
  }, [currentLocationCoords, tripStatus, dropoff_coords, distanceMeters]);

  // cleanup marker
  useEffect(() => {
    return () => {
      pickupLocationMarkerRef.current?.remove();
      destLocationMarkerRef.current?.remove();

      pickupLocationMarkerRef.current = null;
      destLocationMarkerRef.current = null;
    };
  }, []);

  function cancel_trip() {
    if (!data || !driverInfo) return;
    tripCancelDriver({
      rider_id: data.riderId,
      trip_id: data.tripId,
      reason: "Coming soon",
      driver_id: driverInfo.driverId,
    });
  }

  function complete_trip() {
    if (!data) return;
    completeTripMutate({
      rider_id: data.riderId,
      trip_id: data.tripId,
    });
  }

  return (
    <TripContext.Provider
      value={{
        hasActiveTrip,
        isPending,
        isDriverNearDropoff,
        isDriverNearPickup,
        rider_id: data?.riderId as string,
        trip_id: data?.tripId as string,
        cancel_trip,
        complete_trip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export default DriverTripContextProvider;

export function useDriverTripContext() {
  const ctx = useContext(TripContext);

  if (!ctx) {
    throw new Error("useTripContext must be used inside TripContextProvider");
  }

  return ctx;
}
