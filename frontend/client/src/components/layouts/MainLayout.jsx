import { Outlet, Navigate } from "react-router";
import { useRequestStore } from "../../store/RequestStore";
import { useEffect } from "react";
import Navbar from "../common/navbar";

export default function MainLayout() {
  const { user, loadUser } = useRequestStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <Outlet />
      </div>
    </div>
  );
}
