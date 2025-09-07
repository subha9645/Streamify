import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data.user;   // ✅ return only user object
};


export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

// api.js
export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data.recommededUsers || [];  // unwrap array
};



// ✅ My friends
export const getUserFriends = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data;
};

// ✅ Outgoing friend requests
export const getOutgoingFriendReqs = async () => {
  const res = await axiosInstance.get("/users/outgoing-friend-requests");
  return res.data;
};

// ✅ Send friend request
export const sendFriendRequest = async (id) => {
  const res = await axiosInstance.post(`/users/friend-request/${id}`);
  return res.data;
};

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}