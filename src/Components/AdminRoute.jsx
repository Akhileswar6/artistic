import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  const loginTimestamp = localStorage.getItem("adminLoginTimestamp");

  if (!token || !loginTimestamp) {
    return <Navigate to="/admin" />;
  }

  const currentTime = Date.now();
  const twoHours = 2 * 60 * 60 * 1000;

  if (currentTime - parseInt(loginTimestamp) > twoHours) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoginTimestamp");
    return <Navigate to="/admin" />;
  }

  return children;
}