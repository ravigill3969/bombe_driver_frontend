import { useCallback, useState } from "react";
import type { LineString } from "geojson";
import { toast } from "@/components/ui/toast";

export const Routing_Profile = {
  driving: "driving",
  walking: "walking",
} as const;

export type RoutingProfile =
  (typeof Routing_Profile)[keyof typeof Routing_Profile];

export interface RouteMeta {
  geometry: LineString;
  /** Distance in meters */
  distance: number;
  /** Duration in seconds */
  duration: number;
}

export function useUpdateRoute() {
  const [mapBoxFetchError, setMapBoxFetchError] = useState<string>("");

  const fetchRoute = useCallback(
    async (
      start: [number, number], // Must be [lng, lat]
      end: [number, number], // Must be [lng, lat]
      token: string,
      routingProfile: RoutingProfile,
    ): Promise<RouteMeta | null> => {
      if (!start || !end || !token) return null;

      try {
        setMapBoxFetchError("");
        const url = `https://api.mapbox.com/directions/v5/mapbox/${routingProfile}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&overview=full&geometries=geojson&access_token=${token}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Mapbox API error: ${res.statusText}`);

        const data = await res.json();
        console.log(data);

        if (data.code == "NoRoute") {
          toast.add({
            title: "Route",
            description: data.message,
          });

          return null;
        }

        
        const route = data.routes?.[0];

        if (!route) return null;

        return {
          geometry: route.geometry,
          distance: route.distance,
          duration: route.duration,
        };
      } catch (err) {
        console.error("Error fetching directions:", err);
        setMapBoxFetchError("Failed to fetch directions.");
        return null;
      }
    },
    [],
  );

  return { fetchRoute, mapBoxFetchError };
}

export interface MapboxDirections {
  code: string;
  uuid: string;
  waypoints: {
    distance: number;
    name: string;
    location: [number, number];
  }[];
  routes: {
    distance: number;
    duration: number;
    geometry: LineString; // ✅ Use standard GeoJSON type directly
    legs: {
      via_waypoints: [];
      admins: {
        iso_3166_1: string;
        iso_3166_1_alpha3: string;
      }[];
      distance: number;
      duration: number;
      steps: [];
      summary: string;
      weight: number;
    }[];
    weight: number;
    weight_name: string;
  }[];
}
