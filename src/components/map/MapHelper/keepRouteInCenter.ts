import mapboxgl from "mapbox-gl";

export function KeepRouteInCenter(
  pickup_coords: [number, number],
  dropoff_coords: [number, number],
  map: mapboxgl.Map,
) {
  const bounds = new mapboxgl.LngLatBounds()
    .extend(pickup_coords)
    .extend(dropoff_coords);

  map.fitBounds(bounds, {
    padding: { top: 100, bottom: 100, left: 100, right: 100 },
    maxZoom: 15,
    duration: 1000,
  });
}
