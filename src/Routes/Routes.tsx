import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from '../Pages/Dashboard/Dashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AccountVerifyPage from '../Pages/AccountVerify/AccountVerifyPage';
import CaptegoryPage from '../Pages/CategoryPage/CategoryPage';
import VendorPage from '../Pages/Admin/Vendor/VendorPage';
import UpdateProfilePage from "../Pages/UpdateProfilePage/UpdateProfilePage";
import ProductPage from '../Pages/Vendor/Product/VendorProductPage';


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "update-profile", element: <UpdateProfilePage /> },
      {
        path: "verify",
        element: (
          <AccountVerifyPage />
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
          { path: "vendors", element: <VendorPage /> },
          { path: "categories", element: <CaptegoryPage /> },
          { path: "products", element: <ProductPage /> },

          // Add other dashboard routes here
        ]
      },
    ],
  },
]);
