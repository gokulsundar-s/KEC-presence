import { useState } from "react";
import { CloseIcon } from "../../Assets/Icons";
import { ConfirmModal } from "../Modals/Modals";
import { ConfirmIcon } from "../../Assets/Icons";
import "./SideTab.css";

export default function SideTab({
  open,
  setOpen,
  edit,
  setEditData,
  deleteData,
  title,
  children,
}) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  return (
    <div className={open ? "sidetab-overlay" : "r"}>
      <div
        className={
          open ? "sidetab-sidebar sidetab-sidebar-open" : "sidetab-sidebar"
        }
      >
        <div className="sidetab-content-container">
          <div className="sidetab-header">
            <button
              onClick={() => {
                setEditData(false);
                setOpen(false);
              }}
            >
              <CloseIcon />
            </button>
            <p className="sidetab-title">{title}</p>
          </div>
          {children}
        </div>

        <div className="sidetab-footer-buttons">
          {!edit && (
            <button
              className="secondary-button"
              onClick={() => setOpenDeleteModal(true)}
            >
              Delete
            </button>
          )}

          {setEditData && !edit && (
            <button
              className="primary-button"
              onClick={() => setEditData(true)}
            >
              Edit
            </button>
          )}

          {edit && (
            <button
              className="secondary-button"
              onClick={() => {
                setEditData(false);
              }}
            >
              Back
            </button>
          )}

          {edit && (
            <button className="primary-button" onClick={() => {}}>
              Update
            </button>
          )}
        </div>
      </div>

      {openDeleteModal && (
        <ConfirmModal
          icon={<ConfirmIcon />}
          title="Delete User"
          message="Are you sure you want to delete this user?"
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={() => {
            deleteData();
            setOpenDeleteModal(false);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
