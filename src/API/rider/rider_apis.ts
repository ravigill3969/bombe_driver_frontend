import { BACKEND_API } from "@/global/env";
import type { LoginRes, LoginT } from "./rider_types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const useLoginRider = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
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
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['validate_user'] });
      navigate("/rider")
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

export default useLoginRider;
