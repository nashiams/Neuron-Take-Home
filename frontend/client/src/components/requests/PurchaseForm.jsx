import { useState } from "react";

export default function PurchaseForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    item_description: "",
    estimated_cost: "",
    currency: "IDR",
    vendor: "",
    urgency: "normal",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      estimated_cost: Number(formData.estimated_cost),
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="item_description" className="form-label">
          Item Description
        </label>
        <textarea
          className="form-control"
          id="item_description"
          name="item_description"
          rows="2"
          value={formData.item_description}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="row">
        <div className="col-md-8 mb-3">
          <label htmlFor="estimated_cost" className="form-label">
            Estimated Cost
          </label>
          <input
            type="number"
            className="form-control"
            id="estimated_cost"
            name="estimated_cost"
            value={formData.estimated_cost}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="currency" className="form-label">
            Currency
          </label>
          <select
            className="form-select"
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
          >
            <option value="IDR">IDR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="vendor" className="form-label">
          Vendor
        </label>
        <input
          type="text"
          className="form-control"
          id="vendor"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="urgency" className="form-label">
          Urgency
        </label>
        <select
          className="form-select"
          id="urgency"
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          required
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Submit Purchase Request
      </button>
    </form>
  );
}
