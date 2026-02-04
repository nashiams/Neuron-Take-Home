import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import CreateRequest from "./pages/CreateRequest";
import MyRequests from "./pages/MyRequests";
import PendingApprovals from "./pages/PendingApprovals";
import MyApprovals from "./pages/MyApprovals";
import MainLayout from "./components/layouts/MainLayout";
import ManagerLayout from "./components/layouts/ManagerLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/my-requests" />} />
          <Route path="/create-request" element={<CreateRequest />} />
          <Route path="/my-requests" element={<MyRequests />} />

          <Route element={<ManagerLayout />}>
            <Route path="/pending-approvals" element={<PendingApprovals />} />
            <Route path="/my-approvals" element={<MyApprovals />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
