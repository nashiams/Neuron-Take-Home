import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useRequestStore } from "../../store/RequestStore";
import axios from "axios";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department_id: "",
    manager_id: "",
  });

  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const { registerEmployee, loading, error, clearError } = useRequestStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/departments",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setDepartments(response.data.departments || []);
      } catch (error) {
        console.error("Failed to fetch departments");
      }
    };

    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/employees/managers",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setManagers(response.data.managers || []);
      } catch (error) {
        console.error("Failed to fetch managers");
      }
    };

    fetchDepartments();
    fetchManagers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { confirmPassword, ...employeeData } = formData;
    const success = await registerEmployee(employeeData);

    if (success) {
      alert("Employee registered successfully!");
      navigate("/my-requests");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-body p-4">
            <h2 className="card-title mb-4">Register New Employee</h2>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Ahmad Hidayat"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="employee.name@ptmajujaya.co.id"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Production Operator, Finance Staff"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="department_id" className="form-label">
                    Department
                  </label>
                  <select
                    className="form-select"
                    id="department_id"
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="manager_id" className="form-label">
                    Manager (Optional)
                  </label>
                  <select
                    className="form-select"
                    id="manager_id"
                    name="manager_id"
                    value={formData.manager_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Manager</option>
                    {managers.map((mgr) => (
                      <option key={mgr.id} value={mgr.id}>
                        {mgr.name} - {mgr.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Employee"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
