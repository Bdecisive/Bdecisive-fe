// services/RegisterService.ts
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSpinnerAction } from "../Utils/useSpinnerAction";
import { API_URL } from "../Config";
import { ENDPOINTS } from "../Config/endpoints";
import { ApiError } from "../Utils/ApiError";
import { UserRole } from "../Models/enums";
import { RegistrationData } from "../Models/Registration";

export interface VerifyAccountData {
  username: string;
  verificationCode: string;
}

export const registerAPI = async (data: RegistrationData) => {
  try {
    let endpoint = API_URL;
    switch (data.role) {
      case UserRole.VENDOR:
        endpoint += ENDPOINTS.REGISTRATION.VENDOR;
        break;
      case UserRole.INFLUENCER:
        endpoint += ENDPOINTS.REGISTRATION.INFLUENCER;
        break;
      case UserRole.FOLLOWER:
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

export const verifyAccountAPI = async (data: VerifyAccountData) => {
  try {
    return await axios.post(`${API_URL}${ENDPOINTS.AUTH.ACCOUNT_VERIFY}`, data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      throw apiError;
    }
    throw error;
  }
};

const resendVerificationCodeAPI = async (username: string) => {  
  try {
    return await axios.post(`${API_URL}${ENDPOINTS.AUTH.RESEND_VERIFICATION_CODE}?username=${username}`);
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
          navigate('/verify', { 
            state: { 
              username: data.username,
              role: data.role 
            }
          });
        }
      } catch (error) {
        toast.error("Registration failed. Please try again.");
        throw error;
      }
    });
  };

  const verifyAccount = async(data: VerifyAccountData) => {
    await withSpinner(async() => {
      try {
        const res = await verifyAccountAPI(data);
        if (res) {
          navigate('/login')
        }
      } catch (error) {
        toast.error("Email verifiation has failed.");
        throw error;
      }
    });
  };

  const resendVerificationCode = async (username: string) => {  
    await withSpinner(async() => {
      try {
        const res = await resendVerificationCodeAPI(username)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const apiError = error.response?.data as ApiError;
          throw apiError;
        }
        throw error;
      }
    });
  };

  return { registerUser, verifyAccount, resendVerificationCode };
};