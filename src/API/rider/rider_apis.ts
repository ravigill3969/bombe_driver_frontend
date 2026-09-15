import { BACKEND_API } from "@/global/env";
import type {
  LoginRes,
  LoginT,
  LogoutRes,
  RiderRegisterRequest,
  UpdatePasswordRequest,
} from "./rider_types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const useLoginRider = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const login = async (data: LoginT): Promise<LoginRes> => {
    const response = await fetch(`${BACKEND_API}/rider/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    if (!response.ok) {
      const errorMessage = res.message || res.error || "Login failed";
      throw new Error(errorMessage);
    }

    return res;
  };

  return useMutation({
    mutationKey: ["rider_login"],
    mutationFn: login,
    onSuccess: async (data) => {
      toast.success(data.message);
      await queryClient.invalidateQueries({ queryKey: ["validate_user"] });
      navigate("/rider");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

const useRegisterRider = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const register = async (data: RiderRegisterRequest): Promise<LoginRes> => {
    const response = await fetch(`${BACKEND_API}/rider/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    if (!response.ok) {
      const errorMessage = res.message || res.error || "Register failed";
      throw new Error(errorMessage);
    }

    return res;
  };

  return useMutation({
    mutationKey: ["rider_register"],
    mutationFn: register,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["validate_user"] });
      navigate("/rider/login");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

function useUpdateRiderPassword() {
  const updatePassword = async (data: UpdatePasswordRequest) => {
    const response = await fetch(`${BACKEND_API}/rider/update-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    if (!response.ok) {
      const errorMessage = res.message || res.error || "Update password failed";
      throw new Error(errorMessage);
    }

    return res;
  };

  return useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success("password updated");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });
}

const useLogoutRider = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = async (): Promise<LogoutRes> => {
    const response = await fetch(`${BACKEND_API}/rider/logout`, {
      method: "POST",
      credentials: "include",
    });

    const res = await response.json();
    if (!response.ok) {
      const errorMessage = res.message || res.error || "logout failed";
      throw new Error(errorMessage);
    }

    return res;
  };

  return useMutation({
    mutationKey: ["rider_logout"],
    mutationFn: logout,
    onSuccess: (data) => {
      toast.success(data.message);
      // Same as useLogoutDriver: setQueryData notifies the active observer so
      // the cached rider identity clears immediately and the login page stops
      // bouncing us back to /rider.
      queryClient.setQueryData(["validate_user"], null);
      navigate("/rider/login");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });
};

export { useLoginRider, useRegisterRider, useUpdateRiderPassword, useLogoutRider };
