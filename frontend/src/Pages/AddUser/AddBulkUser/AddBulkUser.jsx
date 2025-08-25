import { UploadIcon, DeleteIcon } from "../../../Assets/Icons";
import "./AddBulkUser.css";

export default function AddBulkUser() {
  return (
    <div className="add-bulk-user-container">
      <label class="add-bulk-user-upload-label">
        <div class="add-bulk-user-upload-design">
          <UploadIcon />
          <p>
            Drag and drop or click to upload your file. Only .xlsx file is
            allowed.
          </p>
        </div>
        <input id="file" type="file" />
      </label>

      <div className="add-bulk-user-file-info">
        {false && (
          <>
            <p>File Name</p>
            <button>
              <DeleteIcon />
            </button>
          </>
        )}
      </div>

      <button className="primary-button">Download Template</button>
    </div>
  );
}
