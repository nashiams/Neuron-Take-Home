import { Link, useNavigate } from "react-router";
import { useRequestStore } from "../../store/RequestStore";

export default function Navbar() {
  const { user, logout } = useRequestStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          PT Maju Jaya Approval System
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/my-requests">
                My Requests
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create-request">
                Create Request
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pending-approvals">
                Pending Approvals
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my-approvals">
                My Approvals
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <span className="text-light me-3">
              <strong>{user?.name}</strong> ({user?.role})
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
