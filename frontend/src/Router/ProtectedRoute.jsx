/* eslint-disable react/prop-types */
// components/ProtectedRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
export const ProtectedRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  return state.token || state.userData ? children : <Navigate to="/" replace />;
};
export const LoginRoute = ({ children }) => {
    const { state } = useContext(AuthContext);
    return !state.token || !state.userData ? children : <Navigate to="/chatapp" replace />;
  };