import { useState } from "react";

export default function OvertimeForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    date: "",
    hours: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      hours: Number(formData.hours),
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="date" className="form-label">
            Overtime Date
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="hours" className="form-label">
            Hours
          </label>
          <input
            type="number"
            className="form-control"
            id="hours"
            name="hours"
            min="1"
            max="12"
            value={formData.hours}
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
        Submit Overtime Request
      </button>
    </form>
  );
}
