export default function RequestList({
  requests,
  showActions = false,
  onApprove,
  onReject,
}) {
  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-warning status-pending",
      approved: "bg-success status-approved",
      rejected: "bg-danger status-rejected",
    };
    return badges[status] || "bg-secondary";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderDetails = (request) => {
    const details = request.details;

    if (request.type === "leave") {
      return (
        <div className="request-details">
          <p>
            <strong>Type:</strong> {details.leave_type}
          </p>
          <p>
            <strong>Period:</strong> {details.start_date} to {details.end_date}
          </p>
          <p>
            <strong>Reason:</strong> {details.reason}
          </p>
        </div>
      );
    }

    if (request.type === "purchase") {
      return (
        <div className="request-details">
          <p>
            <strong>Item:</strong> {details.item_description || "N/A"}
          </p>
          <p>
            <strong>Cost:</strong> {details.currency}{" "}
            {details.estimated_cost?.toLocaleString()}
          </p>
          <p>
            <strong>Vendor:</strong> {details.vendor || "N/A"}
          </p>
          <p>
            <strong>Urgency:</strong>{" "}
            <span className="badge bg-secondary">{details.urgency}</span>
          </p>
        </div>
      );
    }

    if (request.type === "overtime") {
      return (
        <div className="request-details">
          <p>
            <strong>Date:</strong> {details.date}
          </p>
          <p>
            <strong>Hours:</strong> {details.hours} hours
          </p>
          <p>
            <strong>Reason:</strong> {details.reason}
          </p>
        </div>
      );
    }
  };

  if (requests.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Requests Found</h3>
        <p>There are no requests to display at this time.</p>
      </div>
    );
  }

  return (
    <div>
      {requests.map((request) => (
        <div key={request.id} className="card request-card">
          <div className="card-body">
            <div className="request-header">
              <div>
                <span className="request-id">{request.id}</span>
                <span className="badge request-type ms-2">{request.type}</span>
              </div>
              <span className={`badge ${getStatusBadge(request.status)}`}>
                {request.status}
              </span>
            </div>

            {request.submitter && (
              <p className="mb-2">
                <strong>Submitted by:</strong> {request.submitter.name} (
                {request.submitter.role})
              </p>
            )}

            <p className="text-muted mb-2">
              <small>Submitted: {formatDate(request.submitted_at)}</small>
            </p>

            {renderDetails(request)}

            {request.notes && (
              <div className="request-notes">
                <strong>Notes:</strong> {request.notes}
              </div>
            )}

            {request.approver && (
              <p className="mt-2 text-success">
                <strong>Approved by:</strong> {request.approver.name} on{" "}
                {formatDate(request.approved_at)}
              </p>
            )}

            {request.rejecter && (
              <p className="mt-2 text-danger">
                <strong>Rejected by:</strong> {request.rejecter.name} on{" "}
                {formatDate(request.rejected_at)}
              </p>
            )}

            {showActions && request.status === "pending" && (
              <div className="action-buttons">
                <button
                  className="btn btn-success"
                  onClick={() => onApprove(request.id)}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onReject(request.id)}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
