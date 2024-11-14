import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI, userProfile } from "../Services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, username: string, password: string) => void;
  loginUser: (username: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
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

  const registerUser = async (
    email: string,
    username: string,
    password: string
  ) => {
    await registerAPI(email, username, password)
      .then((res) => {
        if (res) {
          // localStorage.setItem("token", res?.data.token);
          // const userObj = {
          //   userName: res?.data.userName,
          //   email: res?.data.email,
          //   role: res?.data.role,
          // };
          // localStorage.setItem("user", JSON.stringify(userObj));
          // setToken(res?.data.token!);
          // setUser(userObj!);
          // toast.success("Login Success!");
          // navigate("/search");
        }
      })
      .catch((e) => toast.warning("Server error occured"));
  };

  const loginUser = async (username: string, password: string) => {
    await loginAPI(username, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          setToken(res?.data.token!);
          
          userProfile().then((profileRes) => {
            // Ensure default values are set for userName, email, and role
            const userObj: UserProfile = {
              userName: profileRes?.data.userName || "",  // Default to empty string if undefined
              email: profileRes?.data.email || "",        // Default to empty string if undefined
              role: profileRes?.data.role || "",          // Default to empty string if undefined
            };
            
            localStorage.setItem("user", JSON.stringify(userObj));
            setUser(userObj);
            toast.success("Login Success!");
  
            // Use correct role names in navigation
            if (userObj.role === "ROLE_ADMIN") {
              navigate("/admin");
            } else if (userObj.role === "ROLE_VENDOR") {
              navigate("/vendor");
            }
          });
        }
      })
      .catch(() => toast.warning("Server error occurred"));
  };
  

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser, sideMenuIsExpand, setSideMenuIsExpand, }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
