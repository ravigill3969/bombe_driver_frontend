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
} from "./trip_types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
  const getActiveTripWithDriverId = async (): Promise<ActiveTripResponse> => {
    const res = await fetch(
      `${BACKEND_API}/trip/get-active-trip-with-driverid`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const response = await res.json();
    if (!res.ok) {
      const error: ErrorActiveTripResponse = await res.json();
      throw new Error(error.error);
    }

    return response;
  };

  return useQuery({
    queryKey: ["getActiveTripWithDriverId"],
    queryFn: getActiveTripWithDriverId,
    retry: false,
    refetchInterval: (query) => (query.state.data ? 10_000 : false),
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
  const queryClinet = useQueryClient();
  const completedTrip = async (data: TripCompletedReq): Promise<TripCompletedResT> => {
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
      const errorMessage = response.message || response.error || "completing trip failed";
      throw new Error(errorMessage);
    }

    return response;
  };

  const mutate = useMutation({
    mutationFn: completedTrip,
    mutationKey: ["completedTrip"],
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

export function useGetActiveTripWithRiderId() {
  const getActiveTripWithRiderId = async (): Promise<ActiveTripRiderResponse> => {
    const res = await fetch(
      `${BACKEND_API}/trip/get-active-trip-with-riderid`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const response = await res.json();
    if (!res.ok) {
      const error: ErrorActiveTripResponse = await res.json();
      throw new Error(error.error);
    }

    return response;
  };

  return useQuery({
    queryKey: ["getActiveTripWithRiderId"],
    queryFn: getActiveTripWithRiderId,
    retry: false,
    refetchInterval: (query) => (query.state.data ? 10_000 : false),
  });
}
