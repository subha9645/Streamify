import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const fetchFriends = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data; // backend already returns an array
};

const FriendsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
  });

  if (isLoading) return <div className="p-4">Loading friends...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading friends</div>;

  const friends = data || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Friends</h2>
      {friends.length === 0 ? (
        <p className="text-gray-500">No friends yet. Start connecting!</p>
      ) : (
        <ul className="space-y-3">
          {friends.map((friend) => (
            <li
              key={friend._id}
              className="flex items-center gap-3 p-3 bg-base-200 rounded-xl shadow-sm"
            >
              <img
                src={friend.profilePic}
                alt={friend.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{friend.fullName}</p>
                <p className="text-sm text-gray-500">
                  Speaks {friend.nativeLanguage}, learning {friend.learningLanguage}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsPage;

