import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import VendorPage from '../Pages/VendorPage/VendorPage';
import Dashboard from '../Pages/Dashboard/Dashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';
import CategoryList from '../Pages/Admin/Category/CategoryList';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        path: "vendor",
        element: (
          <ProtectedRoute>
            <VendorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          // { path: "", element: <div>Dashboard Home</div> }, // Add a dashboard home component if needed
          { path: "categories", element: <CategoryList /> },
          // Add other dashboard routes here
        ]
      },
    ],
  },
]);
