import { useState } from "react";
import { CloseIcon } from "../../Assets/Icons";
import "./SideTab.css";

export default function SideTab({ open, setOpen, title, children, footer }) {
  return (
    <div className={open ? "sidetab-overlay" : ""}>
      <div
        className={
          open ? "sidetab-sidebar sidetab-sidebar-open" : "sidetab-sidebar"
        }
      >
        <div className="sidetab-content-container">
          <div className="sidetab-header">
            <button
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon />
            </button>
            <p className="sidetab-title">{title}</p>
          </div>
          {children}
        </div>

        <div className="sidetab-footer-buttons">{footer}</div>
      </div>
    </div>
  );
}
