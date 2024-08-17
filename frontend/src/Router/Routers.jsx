import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Auth/Login";
import App from "../App";
import Register from "../Auth/Register";
import { LoginRoute, ProtectedRoute } from "./ProtectedRoute";

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LoginRoute>
              <Login />
            </LoginRoute>
          }
        />
        <Route
          path="/chatapp"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
