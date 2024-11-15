import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfile, UserProfileToken } from "../Models/User";

const BASE_URL = "http://localhost:8080/api/";

export const loginAPI = async (username: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(BASE_URL + "auth/login", {
      username: username,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const userProfile = async () => {
  try {
    const data = await axios.get<UserProfile>(BASE_URL + "users/profile");
    console.log(JSON.stringify(data));
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const registerAPI = async (
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  password: string,
  role: string
) => {
  try {
    // Dynamically set the API endpoint based on the role
    let endpoint = "";
    switch (role) {
      case "ROLE_VENDOR":
        endpoint = "vendors/create";
        break;
      case "ROLE_INFLUENCER":
        endpoint = "influencers/create";
        break;
      case "ROLE_FOLLOWER":
        endpoint = "followers/create";
        break;
      default:
        throw new Error("Invalid role");
    }

    const data = await axios.post<UserProfileToken>(BASE_URL + endpoint, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: password,
      role: password
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};
