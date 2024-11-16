// services/RegisterService.ts
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSpinnerAction } from "../Utils/useSpinnerAction";
import { API_URL } from "../Config";
import { ENDPOINTS } from "../Config/endpoints";
import { ApiError } from "../Utils/ApiError";

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

export const registerAPI = async (data: RegistrationData) => {
  try {
    let endpoint = API_URL;
    switch (data.role) {
      case "ROLE_VENDOR":
        endpoint += ENDPOINTS.REGISTRATION.VENDOR;
        break;
      case "ROLE_INFLUENCER":
        endpoint += ENDPOINTS.REGISTRATION.INFLUENCER;
        break;
      case "ROLE_FOLLOWER":
        endpoint += ENDPOINTS.REGISTRATION.FOLLOWER;
        break;
      default:
        throw new Error("Invalid role");
    }
    const response = await axios.post(endpoint, data);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      throw apiError;
    }
    throw error;
  }
};

export const useRegister = () => {
  const withSpinner = useSpinnerAction();
  const navigate = useNavigate();

  const registerUser = async (data: RegistrationData) => {
    await withSpinner(async () => {
      try {
        const res = await registerAPI(data);
        if (res) {
          toast.success("Registration successful!");
          navigate("/login");
        }
      } catch (error) {
        toast.error("Registration failed. Please try again.");
        throw error;
      }
    });
  };

  return { registerUser };
};