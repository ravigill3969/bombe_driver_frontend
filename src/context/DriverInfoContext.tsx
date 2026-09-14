import { BACKEND_API } from "@/global/env";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

type DriverInfoT = {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  licenseNo: string;
  imageUrl: string;
  driverId: string;
  isVerified: boolean;
};

type DriverInfoContextT = {
  driverInfo: DriverInfoT | null;
  isPending: boolean;
  isVerified: boolean;
};

const DriverInfoContext = createContext<DriverInfoContextT | null>(null);

export function DriverInfoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isPending } = useQuery({
    queryKey: ["verify_driver"],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_API}/driver/verify`, {
        credentials: "include",
      });

      const res = await response.json();

      if (!response.ok) {
        const err = res.error;

        throw new Error(err.error || "Failed to verify driver");
      }

      return res;
    },
    retry: false,
  });


  const driverInfo: DriverInfoT | null = data
    ? {
        ...data,
        isVerified: true,
      }
    : null;

  return (
    <DriverInfoContext.Provider
      value={{
        driverInfo,
        isPending,
        isVerified: !!driverInfo,
      }}
    >
      {children}
    </DriverInfoContext.Provider>
  );
}

export function useDriverInfoContext() {
  const ctx = useContext(DriverInfoContext);

  if (!ctx)
    throw new Error(
      "useDriverInfoContext must be used within a RiderInfoProvider",
    );

  return ctx;
}
