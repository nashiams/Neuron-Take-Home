import { useState } from "react";
import { useNavigate } from "react-router";
import { useRequestStore } from "../store/RequestStore";
import LeaveForm from "../components/requests/LeaveForm";
import PurchaseForm from "../components/requests/PurchaseForm";
import OvertimeForm from "../components/requests/OvertimeForm";

export default function CreateRequest() {
  const [requestType, setRequestType] = useState("leave");
  const [notes, setNotes] = useState("");
  const { createRequest, loading, error, clearError } = useRequestStore();
  const navigate = useNavigate();

  const handleSubmit = async (details) => {
    clearError();
    const success = await createRequest(requestType, details, notes);
    if (success) {
      alert("Request created successfully!");
      navigate("/my-requests");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h2 className="mb-4">Create New Request</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="form-section">
          <h4 className="form-section-title">Request Type</h4>
          <div className="btn-group w-100 mb-3" role="group">
            <button
              type="button"
              className={`btn ${requestType === "leave" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setRequestType("leave")}
            >
              Leave
            </button>
            <button
              type="button"
              className={`btn ${requestType === "purchase" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setRequestType("purchase")}
            >
              Purchase
            </button>
            <button
              type="button"
              className={`btn ${requestType === "overtime" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setRequestType("overtime")}
            >
              Overtime
            </button>
          </div>
        </div>

        <div className="form-section">
          <h4 className="form-section-title">Request Details</h4>

          {requestType === "leave" && <LeaveForm onSubmit={handleSubmit} />}
          {requestType === "purchase" && (
            <PurchaseForm onSubmit={handleSubmit} />
          )}
          {requestType === "overtime" && (
            <OvertimeForm onSubmit={handleSubmit} />
          )}

          <div className="mt-3">
            <label htmlFor="notes" className="form-label">
              Additional Notes (Optional)
            </label>
            <textarea
              className="form-control"
              id="notes"
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information..."
            ></textarea>
          </div>
        </div>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
