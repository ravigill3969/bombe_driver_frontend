import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import mapboxgl from "mapbox-gl";

import { useGetActiveTripWithRiderId } from "@/API/trip/trip_apis";
import { useRiderMapContext } from "./RiderMapContext";

import type { ActiveTripRiderResponse } from "@/API/trip/trip_types";
import { useWebSocket } from "../WebsocketContext";
import { Routing_Profile, useUpdateRoute } from "@/hooks/useUpdateRoute";
import { MAPBOX_ACCESS_TOKEN } from "@/global/env";

type RiderTripContextT = {
  isPending: boolean;
  hasActiveTrip: boolean;
};

const RiderTripContext = createContext<RiderTripContextT | undefined>(
  undefined,
);

function getCoordinates(
  data: ActiveTripRiderResponse | null | undefined,
  type: "pickup" | "dropoff",
): [number, number] | undefined {
  if (!data) return undefined;

  const location = type === "pickup" ? data.pickup : data.dropoff;

  if (!location) return undefined;

  return [location.longitude, location.latitude];
}

export function RiderTripContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isPending } = useGetActiveTripWithRiderId();
  const navigate = useNavigate();

  // The query resolves with `null` when the rider has no active trip (the
  // backend answers with `{}`), but React Query still reports that as a
  // successful fetch. Derive trip presence from the data instead.
  const hasActiveTrip = data != null;

  useEffect(() => {
    if (!isPending && !hasActiveTrip) {
      navigate("/rider");
    }
  }, [hasActiveTrip, isPending, navigate]);

  const { map } = useRiderMapContext();
  const { fetchRoute } = useUpdateRoute();

  const {
    rider: { driver_location_for_rider: driver_location},
  } = useWebSocket();

  const driverLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const pickupLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const pickup_coords = useMemo(() => getCoordinates(data, "pickup"), [data]);

  const dropoff_coords = useMemo(() => getCoordinates(data, "dropoff"), [data]);

  const driver_coords = useMemo(() => driver_location, [driver_location]);

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

  const tripStatus = data?.rideDetails.status;

  const routeDestination =
    tripStatus === "picked" ? dropoff_coords : pickup_coords;

  useEffect(() => {
    if (!map) return;

    if (!driver_coords) {
      driverLocationMarkerRef.current?.remove();
      driverLocationMarkerRef.current = null;
      return;
    }

    if (!driverLocationMarkerRef.current) {
      driverLocationMarkerRef.current = new mapboxgl.Marker({
        color: "#ef4444",
      })
        .setLngLat(driver_coords)
        .addTo(map);
    } else {
      driverLocationMarkerRef.current.setLngLat(driver_coords);
    }

    return () => {
      if (driverLocationMarkerRef.current) {
        driverLocationMarkerRef.current.remove();
        driverLocationMarkerRef.current = null;
      }
    };
  }, [map, driver_coords]);

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

    if (!driver_coords || !routeDestination) {
      clearRoute();
      return;
    }

    const origin: [number, number] = [driver_coords.lng, driver_coords.lat];

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
  }, [map, routeDestination, fetchRoute, driver_coords]);

  return (
    <RiderTripContext.Provider value={{ isPending, hasActiveTrip }}>
      {" "}
      {children}
    </RiderTripContext.Provider>
  );
}

export default RiderTripContextProvider;

export function useRiderTripContext() {
  const ctx = useContext(RiderTripContext);
  if (!ctx) {
    throw new Error(
      "useRiderTripContext must be used inside TripContextProvider",
    );
  }

  return ctx;
}
