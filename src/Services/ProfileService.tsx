// services/ProfileService.ts
import axios from "axios";
import { toast } from "react-toastify";
import { useSpinnerAction } from "../Utils/useSpinnerAction";
import { API_URL } from "../Config";
import { ENDPOINTS } from "../Config/endpoints";
import { ApiError } from "../Utils/ApiError";
import { UserProfileData } from "../Models/Profile";
import { RegistrationData } from "../Models/Registration";

export const getUserProfileAPI = async (): Promise<RegistrationData> => {
  try {
    const response = await axios.get(`${API_URL}${ENDPOINTS.PROFILE.GET}`);
    return response.data as RegistrationData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      throw apiError;
    }
    throw error;
  }
};

export const updateUserProfileAPI = async (data: UserProfileData) => {
  try {
    const response = await axios.put(`${API_URL}${ENDPOINTS.PROFILE.UPDATE}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      throw apiError;
    }
    throw error;
  }
};

export const useProfileService = () => {
  const withSpinner = useSpinnerAction();

  const fetchUserProfile = async (): Promise<RegistrationData> => {
    return await withSpinner(async () => {
      try {
        const data: RegistrationData = await getUserProfileAPI();
        return data;
      } catch (error) {
        toast.error("Failed to fetch profile data.");
        throw error;
      }
    });
  };

  const updateUserProfile = async (formData: UserProfileData) => {
    console.log("Sending update request with data:", formData);
    try {
      const response = await axios.put("/api/users/profile/update", formData);
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error during profile update:", error);
    }
  };


  return { fetchUserProfile, updateUserProfile };
};
