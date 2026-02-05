import { Outlet, Navigate } from "react-router";
import { useRequestStore } from "../../store/RequestStore";

export default function ManagerLayout() {
  const { user } = useRequestStore();

  const isManager =
    user?.role?.toLowerCase().includes("manager") ||
    user?.role?.toLowerCase().includes("director");

  if (!isManager) {
    return <Navigate to="/my-requests" />;
  }

  return <Outlet />;
}
