import React from "react";

export default function NewRequest() {
  return (
    <div className="page-container">
      <p className="page-header">Add New Request</p>

      <div className="form-container">
        <div className="form-row">
          <div className="form-input">
            <p>Request Type</p>
            <select placeholder="Request Type">
              <option value="leave">Leave</option>
              <option value="od">On Duty</option>
            </select>
          </div>

          <div className="form-input">
            <p>Session</p>
            <select>
              <option value="fd">Full Day</option>
              <option value="fn">Fore Noon</option>
              <option value="an">After Noon</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-input">
            <p>From Date</p>
            <input type="date" />
          </div>

          <div className="form-input">
            <p>From Date</p>
            <input type="date" />
          </div>
        </div>

        <div className="form-input">
          <p>Reason for Leave or On Duty</p>
          <textarea
            type="text"
            placeholder="Your reason to avail leave or on duty"
            rows="4"
          />
        </div>

        <div className="form-input">
          <p>Proof Link</p>
          <input type="text" placeholder="Give your proof link here" />
        </div>

        <div className="form-bottom">
          <p>
            Note: Please make sure your proof link is accessible to the
            reviewers
          </p>
          <button type="submit">Submit</button>
        </div>
      </div>
    </div>
  );
}
