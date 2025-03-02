import { JSX } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  user,
  children,
}: {
  user: any;
  children: JSX.Element;
}) => {
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
