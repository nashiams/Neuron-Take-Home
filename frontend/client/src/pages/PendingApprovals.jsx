import { useEffect, useState } from "react";
import { useRequestStore } from "../store/RequestStore";
import RequestList from "../components/requests/RequestList";

export default function PendingApprovals() {
  const {
    pendingApprovals,
    fetchPendingApprovals,
    approveRequest,
    rejectRequest,
    loading,
  } = useRequestStore();
  const [actionNotes, setActionNotes] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    fetchPendingApprovals();
  }, [fetchPendingApprovals]);

  const handleApprove = (id) => {
    setSelectedRequestId(id);
    setActionType("approve");
  };

  const handleReject = (id) => {
    setSelectedRequestId(id);
    setActionType("reject");
  };

  const confirmAction = async () => {
    if (actionType === "approve") {
      const success = await approveRequest(selectedRequestId, actionNotes);
      if (success) {
        alert("Request approved successfully!");
        fetchPendingApprovals();
      }
    } else if (actionType === "reject") {
      const success = await rejectRequest(selectedRequestId, actionNotes);
      if (success) {
        alert("Request rejected successfully!");
        fetchPendingApprovals();
      }
    }
    setSelectedRequestId(null);
    setActionType(null);
    setActionNotes("");
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pending Approvals</h2>
        <span className="badge bg-warning text-dark">
          {pendingApprovals.length} Pending
        </span>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <RequestList
          requests={pendingApprovals}
          showActions={true}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Modal for confirmation */}
      {selectedRequestId && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {actionType === "approve"
                    ? "Approve Request"
                    : "Reject Request"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setSelectedRequestId(null);
                    setActionType(null);
                    setActionNotes("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to {actionType} request{" "}
                  <strong>{selectedRequestId}</strong>?
                </p>
                <div className="mb-3">
                  <label htmlFor="actionNotes" className="form-label">
                    Notes (Optional)
                  </label>
                  <textarea
                    className="form-control"
                    id="actionNotes"
                    rows="3"
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Add any notes for this decision..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedRequestId(null);
                    setActionType(null);
                    setActionNotes("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${actionType === "approve" ? "btn-success" : "btn-danger"}`}
                  onClick={confirmAction}
                >
                  Confirm {actionType === "approve" ? "Approval" : "Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
