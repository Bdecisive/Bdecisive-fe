import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User";
import { useNavigate } from "react-router-dom";
import { loginAPI, LoginData } from "../Services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";
import { useSpinnerAction } from "../Utils/useSpinnerAction";
import { useSpinner } from "./SpinnerContext";
import { UserRole } from "../Models/enums";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  loginUser: (data: LoginData) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  isAdmin: () => boolean;
  isVendor: () => boolean;
  isInfluencer: () => boolean;
  isFollower: () => boolean;
  sideMenuIsExpand: boolean;
  setSideMenuIsExpand: React.Dispatch<React.SetStateAction<boolean>>;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [sideMenuIsExpand, setSideMenuIsExpand] = useState(true);
  const withSpinner = useSpinnerAction();


  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsReady(true);
  }, []);

  const loginUser = async (data: LoginData) => {
    await withSpinner(async () => {
      try {
        const res = await loginAPI(data);

        if (res) {
          const token = res.data.token;
          localStorage.setItem("token", token);
          setToken(token);

          const base64Payload = token.split(".")[1];
          const decodedPayload = JSON.parse(atob(base64Payload));

          const userObj: UserProfile = {
            id: decodedPayload.id || '',
            name: decodedPayload.name || '',
            email: decodedPayload.email || '',
            role: decodedPayload.roles || '',
          };

          localStorage.setItem("user", JSON.stringify(userObj));
          setUser(userObj);

          toast.success("Login Success!");
          navigate("/dashboard");
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "Server error occurred";
        throw new Error(errorMessage); // Pass the message up to the LoginPage
      }
    });
  };


  const isLoggedIn = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user?.role === UserRole.ADMIN;
  };

  const isVendor = () => {
    return user?.role === UserRole.VENDOR;
  }

  const isInfluencer = () => {
    return user?.role === UserRole.INFLUENCER;
  }

  const isFollower = () => {
    return user?.role === UserRole.FOLLOWER;
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, sideMenuIsExpand, setSideMenuIsExpand, 
        isAdmin, isVendor, isInfluencer, isFollower}}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
