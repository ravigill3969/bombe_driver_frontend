import { MAPBOX_ACCESS_TOKEN } from "@/global/env";

export interface SearchLocationResT {
  id: string;
  name: string; // E.g., "61 Drinking Lane"
  fullName: string; // E.g., "61 Drinking Lane, Toronto, ON, Canada"
  coordinates: [number, number]; // [lng, lat]
}

function useSearchLocation() {
  const serachLocation = async (
    query: string,
  ): Promise<SearchLocationResT[]> => {
    if (query.length < 2) {
      return []
    }

    const url = `
      https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query,
      )}.json?country=ca&bbox=-141,41.7,-52.6,83.1&autocomplete=true&limit=5&access_token=${
        MAPBOX_ACCESS_TOKEN
      }
    `;
    const response = await fetch(url);

    const res = await response.json();
    if (!response.ok) {
      console.log(res);
      return [];
    }

    return res.features.map((feature) => ({
            id: feature.id,
            name: feature.text,             // Mapbox '.text' becomes your '.name'
            fullName: feature.place_name,   // Mapbox '.place_name' becomes your '.fullName'
            coordinates: feature.center,    // Mapbox '.center' becomes your '.coordinates'
          }));  };

  return serachLocation;
}

export default useSearchLocation;
