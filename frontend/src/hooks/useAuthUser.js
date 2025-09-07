import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const queryClient = useQueryClient();

  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  const clearAuthUser = () => queryClient.setQueryData(["authUser"], null);

  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data,  // ✅ assume api.js already returns user object
    clearAuthUser,
  };
};

export default useAuthUser;



