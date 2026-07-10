import { useState } from "react";

function useGetUserLiveLocation() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
      },
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }

  return [latitude, longitude];
}

export default useGetUserLiveLocation;
