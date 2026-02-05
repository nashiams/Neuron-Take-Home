import { useEffect } from "react";
import { useRequestStore } from "../store/RequestStore";
import RequestList from "../components/requests/RequestList";

export default function MyApprovals() {
  const { myApprovals, fetchMyApprovals, loading } = useRequestStore();

  useEffect(() => {
    fetchMyApprovals();
  }, [fetchMyApprovals]);

  const approvedCount = myApprovals.filter(
    (r) => r.status === "approved",
  ).length;
  const rejectedCount = myApprovals.filter(
    (r) => r.status === "rejected",
  ).length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Approval History</h2>
        <div>
          <span className="badge bg-success me-2">
            {approvedCount} Approved
          </span>
          <span className="badge bg-danger">{rejectedCount} Rejected</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <RequestList requests={myApprovals} />
      )}
    </div>
  );
}
