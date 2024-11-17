import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfile, UserProfileToken } from "../Models/User";
import { API_URL } from "../Config";
import { ENDPOINTS } from "../Config/endpoints";

export interface LoginData {
  username: string;
  password: string;
}

export const loginAPI = async (data: LoginData) => {
  try {
    const response = await axios.post<UserProfileToken>(`${API_URL}${ENDPOINTS.AUTH.LOGIN}`, data)
    return response;
  } catch (error) {
    throw error;
  }
};

export const userProfile = async () => {
  try {
    const data = await axios.get<UserProfile>(API_URL + "users/profile");
    console.log(JSON.stringify(data));
    return data;
  } catch (error) {
    throw error;
  }
};
