import { useEffect } from "react";
import { useRequestStore } from "../store/RequestStore";
import RequestList from "../components/requests/RequestList";

export default function MyRequests() {
  const { requests, fetchMyRequests, loading } = useRequestStore();

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Requests</h2>
        <span className="badge bg-primary">{requests.length} Total</span>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <RequestList requests={requests} />
      )}
    </div>
  );
}
