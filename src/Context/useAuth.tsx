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
  registerUser: (firstName: string, lastName: string, email: string, username: string, password: string, role: string) => void;
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
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    role: string
  ) => {
    await registerAPI(firstName, lastName, email, username, password, role)
      .then((res) => {
        if (res) {
          toast.success("Login Success!");
          navigate("/login");
        }
      })
      .catch((e) => toast.warning("Server error occured"));
  };

  const loginUser = async (username: string, password: string) => {
    await loginAPI(username, password)
      .then((res) => {
        if (res) {
          const token = res.data.token;
          localStorage.setItem("token", token);
          setToken(token);

          // Decode the JWT token to extract user information
          const base64Payload = token.split(".")[1];
          const decodedPayload = JSON.parse(atob(base64Payload));
          console.log(decodedPayload);

          // Map the decoded payload to user profile properties
          const userObj: UserProfile = {
            name: decodedPayload.name || "",
            email: decodedPayload.email || "",
            role: decodedPayload.roles || "",
          };

          // Save user info in local storage and set user state
          localStorage.setItem("user", JSON.stringify(userObj));
          setUser(userObj);

          toast.success("Login Success!");

          navigate("/dashboard");
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
