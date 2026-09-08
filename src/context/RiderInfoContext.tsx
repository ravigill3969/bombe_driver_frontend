import { BACKEND_API } from "@/global/env";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

export interface RiderInfoI {
  firstname: string;
  lastname: string;
  email: string;
  id: string;
  image_url: string;
  phone_number: string;
  isVerified: boolean;
  rating: number;
}

type VerifyUserRes = {
  message: string,
  isSuccess: boolean
  data: Omit<RiderInfoI, "isVerified">;
};

interface RiderInfoContextType {
  riderInfo: RiderInfoI | null;
  isLoading: boolean;
  isVerified: boolean;
}

const RiderInfoContext = createContext<RiderInfoContextType | undefined>(
  undefined,
);

export function RiderInfoProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["validate_user"],
    queryFn: async (): Promise<VerifyUserRes> => {
      const response = await fetch(`${BACKEND_API}/rider/verify`, {
        credentials: "include",
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || "Failed to verify rider");
      }
      console.log(res);
      return res;
    },
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      navigate("/rider/login", { replace: true });
    }
  }, [isError, navigate]);

  const riderInfo: RiderInfoI | null = data
    ? { ...data.data, isVerified: true }
    : null;

  return (
    <RiderInfoContext.Provider
      value={{
        riderInfo,
        isLoading,
        isVerified: !!riderInfo,
      }}
    >
      {children}
    </RiderInfoContext.Provider>
  );
}

export const useRiderInfoContext = () => {
  const ctx = useContext(RiderInfoContext);

  if (!ctx) {
    throw new Error(
      "useRiderInfoContext must be used within a RiderInfoProvider",
    );
  }

  return ctx;
};
