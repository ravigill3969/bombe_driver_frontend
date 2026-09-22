import { BACKEND_API } from "@/global/env";
import type {
  ActiveTripResponse,
  AssignDriverRequestT,
  AssignDriverResponseT,
  ErrorActiveTripResponse,
  UpdateTripStatusToAssignedReqT,
  UpdateTripStatusToAssignedResT,
  TripCompletedReq,
  TripCompletedResT,
  ActiveTripRiderResponse,
  CancelTripWithDriverIdRequest,
  EmptyActiveTripResponse,
  DriversTodayEarningsResponse,
} from "./trip_types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export function useAssignTripToDriver() {
  const queryClinet = useQueryClient();
  const assignTripToDriver = async (
    data: AssignDriverRequestT,
  ): Promise<AssignDriverResponseT> => {
    const response = await fetch(`${BACKEND_API}/trip/assign-driver`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    if (!response.ok) {
      const errorMessage = res.message || res.error || "Assigning trip failed";
      throw new Error(errorMessage);
    }

    return res;
  };

  const mutate = useMutation({
    mutationKey: ["assignTripToDriver"],
    mutationFn: assignTripToDriver,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClinet.invalidateQueries({
        queryKey: ["getActiveTripWithDriverId"],
      });
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  return mutate;
}
export function useGetActiveTripWithDriverId() {
  const getActiveTripWithDriverId =
    async (): Promise<ActiveTripResponse | null> => {
      const res = await fetch(
        `${BACKEND_API}/trip/get-active-trip-with-driverid`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const response:
        ActiveTripResponse | EmptyActiveTripResponse | ErrorActiveTripResponse =
        await res.json();

      if (!res.ok) {
        throw new Error((response as ErrorActiveTripResponse).error);
      }

      if (!response || Object.keys(response).length === 0) {
        return null;
      }

      return response as ActiveTripResponse;
    };

  return useQuery({
    queryKey: ["getActiveTripWithDriverId"],
    queryFn: getActiveTripWithDriverId,
    retry: false,
  });
}

export function useUpdateTripStatusToPicked() {
  const queryClinet = useQueryClient();
  const assignTripToDriver = async (
    data: UpdateTripStatusToAssignedReqT,
  ): Promise<UpdateTripStatusToAssignedResT> => {
    console.log(data);
    const response = await fetch(`${BACKEND_API}/trip/rider-picked`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    if (!response.ok) {
      const errorMessage = res.message || res.error || "Assigning trip failed";
      throw new Error(errorMessage);
    }

    return res;
  };

  const mutate = useMutation({
    mutationKey: ["assignTripToDriver"],
    mutationFn: assignTripToDriver,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClinet.invalidateQueries({
        queryKey: ["getActiveTripWithDriverId"],
      });
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  return mutate;
}

export function useCompletedTrip() {
  const navigate = useNavigate();
  const queryClinet = useQueryClient();
  const completedTrip = async (
    data: TripCompletedReq,
  ): Promise<TripCompletedResT> => {
    const res = await fetch(`${BACKEND_API}/trip/trip-completed`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (!res.ok) {
      const errorMessage =
        response.message || response.error || "completing trip failed";
      throw new Error(errorMessage);
    }

    return response;
  };

  const mutate = useMutation({
    mutationFn: completedTrip,
    mutationKey: ["completedTrip"],
    onSuccess: (data) => {
      queryClinet.setQueryData(["getActiveTripWithDriverId"], null);
      queryClinet.invalidateQueries({
        queryKey: ["getActiveTripWithDriverId"],
      });
      navigate("/driver");
      toast.success(data.message);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  return mutate;
}

export function useGetActiveTripWithRiderId() {
  const getActiveTripWithRiderId =
    async (): Promise<ActiveTripRiderResponse | null> => {
      const res = await fetch(
        `${BACKEND_API}/trip/get-active-trip-with-riderid`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const response:
        | ActiveTripRiderResponse
        | EmptyActiveTripResponse
        | ErrorActiveTripResponse = await res.json();

      if (!res.ok) {
        throw new Error((response as ErrorActiveTripResponse).error);
      }

      if (!response || Object.keys(response).length === 0) {
        return null;
      }

      return response as ActiveTripRiderResponse;
    };

  return useQuery({
    queryKey: ["getActiveTripWithRiderId"],
    queryFn: getActiveTripWithRiderId,
    retry: false,
  });
}

export function useCancelTripWithDriverId() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getActiveTripWithDriverId = async (
    data: CancelTripWithDriverIdRequest,
  ): Promise<ActiveTripRiderResponse> => {
    const res = await fetch(
      `${BACKEND_API}/trip/cancel-active-trip-with-driverid`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const response = await res.json();
    if (!res.ok) {
      const error: ErrorActiveTripResponse = await res.json();
      throw new Error(error.error);
    }

    return response;
  };

  return useMutation({
    mutationKey: ["getActiveTripWithDriverId"],
    mutationFn: getActiveTripWithDriverId,
    onSuccess: () => {
      queryClient.setQueryData(["getActiveTripWithDriverId"], null);
      queryClient.invalidateQueries({
        queryKey: ["getActiveTripWithDriverId"],
      });
      navigate("/driver");
    },
    retry: false,
  });
}

export function useGetDriversTodayEarnings() {
  const getDriversTodayEarnings = async () :Promise<DriversTodayEarningsResponse> => {
    const res = await fetch(
      `${BACKEND_API}/trip/get-drivers-today-earnings`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const response = await res.json();

    if (!res.ok) {
      throw new Error("Unable to get drivers earnings");
    }

    return response;
  };

  return useQuery({
    queryKey: ["getDriversTodayEarnings"],
    queryFn: getDriversTodayEarnings,
    retry: false,
  });
}
