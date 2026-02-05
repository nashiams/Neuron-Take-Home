import { useState } from "react";

export default function LeaveForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    leave_type: "annual",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="leave_type" className="form-label">
          Leave Type
        </label>
        <select
          className="form-select"
          id="leave_type"
          name="leave_type"
          value={formData.leave_type}
          onChange={handleChange}
          required
        >
          <option value="annual">Annual Leave</option>
          <option value="sick">Sick Leave</option>
          <option value="emergency">Emergency Leave</option>
        </select>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="start_date" className="form-label">
            Start Date
          </label>
          <input
            type="date"
            className="form-control"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="end_date" className="form-label">
            End Date
          </label>
          <input
            type="date"
            className="form-control"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="reason" className="form-label">
          Reason
        </label>
        <textarea
          className="form-control"
          id="reason"
          name="reason"
          rows="3"
          value={formData.reason}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Submit Leave Request
      </button>
    </form>
  );
}
