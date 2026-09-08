import { MAPBOX_ACCESS_TOKEN } from "@/global/env";
import { useState } from "react";

function useReverseGeocoding() {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const reverseGeocoding = async (
    lngAndLat: [number, number] | undefined,
  ): Promise<string | undefined> => {
    if (!lngAndLat) return;
    try {
      setError(undefined);
      const res = await fetch(
        `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lngAndLat[0]}&latitude=${lngAndLat[1]}&limit=1&access_token=${MAPBOX_ACCESS_TOKEN}`,
      );

      if (!res.ok) {
        setError("Internal server error");
        return undefined;
      }

      const response = await res.json();
      const fetchedAddress = response.features?.[0]?.properties?.full_address;

      if (fetchedAddress) {
        setAddress(fetchedAddress);
        return fetchedAddress;
      }

      return undefined;
    } catch {
      setError("Failed to resolve address");
      return undefined;
    }
  };

  return { reverseGeocoding, address, error };
}

export default useReverseGeocoding;
