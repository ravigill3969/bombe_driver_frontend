import { useState } from "react";
import { Car, CarTaxiFront, Van } from "lucide-react";
import { useRiderMapContext } from "@/context/map/RiderMapContext";
import useCreateCheckOutSession from "@/API/payment/payment_api";
import type { ServiceType } from "@/API/payment/payment_types";

function RideOptionsPanel() {
  const { mutate } = useCreateCheckOutSession();

  const {
    routeMeta,
    pickupLocationName,
    pickup_coords,
    dropoffLocationName,
    dropoff_coords,
  } = useRiderMapContext();
  const [selectedType, setSelectedType] = useState("");

  if (!routeMeta) {
    return (
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 pointer-events-none">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-4 shadow-2xl">
          <p className="text-sm font-medium text-zinc-500 animate-pulse">
            Setting up your ride options…
          </p>
        </div>
      </div>
    );
  }

  const distanceInKm = routeMeta.distance / 1000;
  const durationInMin = routeMeta.duration / 60;

  const allRides = [
    {
      type: "SERVICE_TYPE_ECONOMY",
      name: "Economy",
      description: "Affordable everyday rides",
      seats: 4,
      basePrice: 120,
      perKmPrice: 12,
      perMinPrice: 2,
      etaMultiplier: 1,
      icon: Car,
      iconColors: "bg-zinc-100 text-zinc-900",
    },
    {
      type: "SERVICE_TYPE_COMFORT",
      name: "Comfort",
      description: "Newer cars with extra legroom",
      seats: 4,
      basePrice: 180,
      perKmPrice: 16,
      perMinPrice: 3,
      etaMultiplier: 1.05,
      icon: CarTaxiFront,
      iconColors: "bg-blue-100 text-blue-700",
    },
    {
      type: "SERVICE_TYPE_XL",
      name: "XL",
      description: "SUVs and vans for up to 6",
      seats: 6,
      basePrice: 260,
      perKmPrice: 20,
      perMinPrice: 4,
      etaMultiplier: 1.1,
      icon: Van,
      iconColors: "bg-amber-100 text-amber-700",
    },
  ];

  const dollarSign = "$";

  return (
    <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4 pointer-events-none">
      <div className="mx-auto max-w-md flex flex-col gap-2 max-h-[45vh] overflow-y-auto pointer-events-auto">
        {allRides.map((ride, index) => {
          // price calc
          const rawPrice =
            ride.basePrice +
            ride.perKmPrice * distanceInKm +
            ride.perMinPrice * durationInMin;
          const roundedPrice = Math.round((rawPrice * 1.15) / 10) * 10;
          const priceInDollars = roundedPrice / 100;
          const priceText = dollarSign + priceInDollars.toFixed(2);

          // eta calc
          const etaInMin = Math.round(
            (routeMeta.duration / 60) * ride.etaMultiplier,
          );
          let etaText = etaInMin + " min";
          if (etaInMin >= 60) {
            const hours = Math.floor(etaInMin / 60);
            const extraMin = etaInMin % 60;
            if (extraMin > 0) {
              etaText = hours + " hr " + extraMin + " min";
            } else {
              etaText = hours + " hr";
            }
          }

          const Icon = ride.icon;
          const isSelected = selectedType === ride.type;

          return (
            <button
              key={index}
              type="button"
              onClick={() => {
                console.log("clicked ride: " + ride.name);
                setSelectedType(ride.type);

                if (!pickup_coords || !dropoff_coords) {
                  console.log("missing pickup or dropoff coords!");
                  return;
                }

                const serviceType = ride.type as ServiceType;

                mutate({
                  serviceType: serviceType,
                  pickup: {
                    latitude: pickup_coords[1],
                    longitude: pickup_coords[0],
                    address: pickupLocationName,
                  },
                  dropoff: {
                    latitude: dropoff_coords[1],
                    longitude: dropoff_coords[0],
                    address: dropoffLocationName,
                  },
                  fare: {
                    amountInCents: roundedPrice,
                    currency: "USD",
                  },
                  ride_details: {
                    distanceMetrs: Math.round(routeMeta.distance),
                    durationSeconds: Math.round(routeMeta.duration * 60),
                  },
                });
              }}
              className={
                "flex items-center gap-3 sm:gap-4 rounded-2xl bg-white p-3 sm:p-4 text-left shadow-xl ring-1 ring-black/5 transition-all cursor-pointer " +
                (isSelected ? "ring-2 ring-black bg-zinc-50" : "")
              }
            >
              <span
                className={
                  "flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full " +
                  ride.iconColors
                }
              >
                <Icon className="size-6" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-zinc-900">
                  {ride.name}
                </span>
                <span className="block truncate text-sm text-zinc-500">
                  {ride.description} · {ride.seats} seats · {etaText} away
                </span>
              </span>

              <span className="shrink-0 text-right">
                <span className="block text-sm font-bold text-zinc-900">
                  {priceText}
                </span>
                <span className="block text-xs text-zinc-400">est.</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RideOptionsPanel;
