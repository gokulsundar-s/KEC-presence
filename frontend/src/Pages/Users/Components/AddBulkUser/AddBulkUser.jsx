import { useState } from "react";
import { UploadIcon, DeleteIcon, DownloadIcon } from "../../../../Assets/Icons";
import * as XLSX from "xlsx";
import { showErrorToast } from "../../../../Components/Alerts/Alert";
import "./AddBulkUser.css";

export default function AddBulkUser({ setBulkUserData }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];

    if (
      !uploadedFile ||
      uploadedFile.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      showErrorToast("Please upload a valid .xlsx file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      setBulkUserData(jsonData);
      setFile(uploadedFile);
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleFileRemove = () => {
    setFile(null);
    setBulkUserData([]);
  };

  const downloadTemplate = () => {
    const templateHeaders = [
      [
        "userType",
        "department",
        "name",
        "rollNumber",
        "year",
        "section",
        "mail",
        "phoneNumber",
        "parentMail",
        "parentPhone",
      ],
    ];
    const templateSheet = XLSX.utils.aoa_to_sheet(templateHeaders);

    const infoData = [
      ["Field", "Allowed Values"],
      ["userType", "ADM, STU, CA, YI, HOD"],
      ["department", "CSE, IT, CSD"],
      ["year", "1, 2, 3, 4, 5"],
      ["section", "A, B, C, D, E, F"],
    ];
    const infoSheet = XLSX.utils.aoa_to_sheet(infoData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, templateSheet, "Template");
    XLSX.utils.book_append_sheet(workbook, infoSheet, "Info");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Users_Template.xlsx";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="add-bulk-user-container">
      <label className="add-bulk-user-upload-label">
        <div className="add-bulk-user-upload-design">
          <UploadIcon />
          <p>
            Drag and drop or click to upload your file. Only .xlsx file is
            allowed.
          </p>
        </div>
        <input
          id="file"
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </label>

      <div className="add-bulk-user-file-info">
        {file && (
          <>
            <p>{file.name}</p>
            <button onClick={handleFileRemove}>
              <DeleteIcon />
            </button>
          </>
        )}
      </div>

      <button className="primary-button" onClick={downloadTemplate}>
        <DownloadIcon />
        Download Template
      </button>
    </div>
  );
}
