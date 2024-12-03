import axios from "axios";

export const useProfileService = () => {
  const getUserProfile = async () => {
    try {
      const response = await axios.get("/api/users/profile");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw new Error("Could not fetch user profile");
    }
  };

  const updateUserProfile = async (profileData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    phone?: string;
    address?: string;
    description?: string;
  }) => {
    try {
      const response = await axios.put("/api/users/profile/update", profileData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw new Error("Could not update user profile");
    }
  };

  return { getUserProfile, updateUserProfile };
};
