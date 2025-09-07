import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const queryClient = useQueryClient();

  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  // helper to reset authUser after logout
  const clearAuthUser = () => queryClient.setQueryData(["authUser"], null);

  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data?.user,
    clearAuthUser,
  };
};

export default useAuthUser;


