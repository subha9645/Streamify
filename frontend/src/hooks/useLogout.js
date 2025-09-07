import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";

const useLogout = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null); // clear auth cache
      window.location.href = "/login"; // redirect
    },
  });

  return {
    logoutMutation: mutation.mutate, // 👈 return the mutate function
    isPending: mutation.isPending,
  };
};

export default useLogout;
