import { useDriverMapContext } from "@/context/map/DriverMapContext";
import { useEffect, useRef } from "react";

export default function DriverMapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { map, addContainer, removeContainer, locationError } =
    useDriverMapContext();

  useEffect(() => {
    if (!containerRef.current || !map) return;

    addContainer(containerRef.current);

    return () => {
      removeContainer();
    };
  }, [map, addContainer, removeContainer]);

  return (
    <div className="relative h-full w-full min-h-100">
      <div
        className="h-full w-full rounded-2xl overflow-hidden"
        ref={containerRef}
      />

      {locationError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 text-white p-6 rounded-2xl text-center">
          <p className="text-lg font-bold">Location Access Blocked</p>
          <p className="text-sm text-gray-300 mt-2">
            Location not accessible. Allow this site to use live location in
            your browser settings.
          </p>
        </div>
      )}
    </div>
  );
}
