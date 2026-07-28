import React from "react";
import { X } from "lucide-react";

// Generic centered modal shell for the institute portal (same look as
// MemberFormModal). Children render inside a scrollable body.
const Modal = ({ title, onClose, children, maxWidth = "max-w-2xl" }) => (
  <div
    className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/50 p-4"
    dir="rtl"
  >
    <div className={`my-8 w-full ${maxWidth} rounded-2xl bg-surface-card shadow-xl`}>
      <div className="flex items-center justify-between border-b-[0.5px] border-border-subtle px-6 py-4">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-text-secondary hover:bg-neutral-100"
          aria-label="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export default Modal;
