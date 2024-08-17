import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Routers from "./Router/Routers.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Routers />
    </AuthProvider>
  </StrictMode>
);
