import { Outlet, Navigate } from "react-router";
import { useRequestStore } from "../../store/RequestStore";

export default function ManagerLayout() {
  const { user } = useRequestStore();

  // Check if user is a manager (has subordinates)
  // For simplicity, check if role contains "Manager" or "Director"
  const isManager =
    user?.role?.toLowerCase().includes("manager") ||
    user?.role?.toLowerCase().includes("director");

  if (!isManager) {
    return <Navigate to="/my-requests" />;
  }

  return <Outlet />;
}
