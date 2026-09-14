import { BACKEND_API } from "@/global/env";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { DriverRegisterRequest, LoginRes, LoginT } from "./driver_types";
import { useNavigate } from "react-router";

const useLoginDriver = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const login = async (data: LoginT): Promise<LoginRes> => {
    const response = await fetch(`${BACKEND_API}/driver/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    console.log(res);
    if (!response.ok) {
      const errorMessage = res.message || res.error || "Login failed";
      throw new Error(errorMessage);
    }
    

    return res;
  };

  return useMutation({
    mutationKey: ["driver_login"],
    mutationFn: login,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["verify_driver"] });
      navigate("/driver");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });
};

const useRegisterDriver = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const register = async (data: DriverRegisterRequest): Promise<LoginRes> => {
    const response = await fetch(`${BACKEND_API}/driver/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    console.log(res);
    if (!response.ok) {
      const errorMessage = res.message || res.error || "Register failed";
      throw new Error(errorMessage);
    }

    return res;
  };

  return useMutation({
    mutationKey: ["driver_register"],
    mutationFn: register,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["verify_driver"] });
      navigate("/driver/login");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });
};

export { useLoginDriver, useRegisterDriver };
