export default function RequestForm({ requestData = {}, setRequestData }) {
  console.log("requestData", requestData);

  return (
    <div className="sidebar-form-container">
      <div className="sidebar-form-form">
        <div className="form-input">
          <p>Request Type</p>
          <select
            value={requestData.reqType}
            onChange={(e) =>
              setRequestData({ ...requestData, reqType: e.target.value })
            }
          >
            <option value="">Select Request Type</option>
            <option value="OD">On-Duty</option>
            <option value="LEAVE">Leave</option>
          </select>
        </div>

        <div className="form-input">
          <p>From Date</p>
          <input
            type="date"
            value={requestData.fromDate}
            onChange={(e) =>
              setRequestData({ ...requestData, fromDate: e.target.value })
            }
          />
        </div>

        <div className="form-input">
          <p>From Session</p>
          <select
            value={requestData.fromSession}
            onChange={(e) =>
              setRequestData({ ...requestData, fromSession: e.target.value })
            }
          >
            <option value="">From Session</option>
            <option value="FD">Full Day</option>
            <option value="FN">Fore Noon</option>
            <option value="AN">After Noon</option>
          </select>
        </div>

        <div className="form-input">
          <p>To Date</p>
          <input
            type="date"
            value={requestData.toDate}
            onChange={(e) =>
              setRequestData({ ...requestData, toDate: e.target.value })
            }
          />
        </div>

        <div className="form-input">
          <p>To Session</p>
          <select
            value={requestData.toSession}
            onChange={(e) =>
              setRequestData({ ...requestData, toSession: e.target.value })
            }
          >
            <option value="">To Session</option>
            <option value="FD">Full Day</option>
            <option value="FN">Fore Noon</option>
            <option value="AN">After Noon</option>
          </select>
        </div>

        <div className="form-input">
          <p>Reason for Leave or On Duty</p>
          <textarea
            type="text"
            placeholder="Your reason to avail leave or on duty"
            rows="4"
            value={requestData.reason}
            onChange={(e) =>
              setRequestData({ ...requestData, reason: e.target.value })
            }
          />
        </div>

        <div className="form-input">
          <p>Proof Link</p>
          <input
            type="text"
            placeholder="Give your proof link here"
            value={requestData.proofLink}
            onChange={(e) =>
              setRequestData({ ...requestData, proofLink: e.target.value })
            }
          />
        </div>

        <div className="form-info">
          <p>
            Note: Please make sure your proof link is accessible to the
            reviewers
          </p>
        </div>
      </div>
    </div>
  );
}
