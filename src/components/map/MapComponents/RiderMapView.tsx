import { useRiderMapContext } from "@/context/map/RiderMapContext";
import { useEffect, useRef } from "react";

function RiderMapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { map, addContainer, removeContainer, emptyScreenMsg, mapBoxFetchError } =
    useRiderMapContext();

  useEffect(() => {
    if (!containerRef.current || !map) return;

    addContainer(containerRef.current);

    return () => {
      removeContainer();
    };
  }, [map, addContainer, removeContainer]);

  return (
    <div className="relative h-full w-full">
      {emptyScreenMsg.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 text-lg font-semibold">
          {emptyScreenMsg}
        </div>
      )}

      {mapBoxFetchError.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 text-lg font-semibold">
          {mapBoxFetchError}
        </div>
      )}
      <div className="h-full w-full" ref={containerRef} />
    </div>
  );
}

export default RiderMapView;
