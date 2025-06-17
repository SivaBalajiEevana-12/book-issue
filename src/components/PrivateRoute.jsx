import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
