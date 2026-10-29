import React from "react";
import { Dialog } from "../ui/Dialog";

const SIZE_FROM_WIDTH = {
  "max-w-md": "sm",
  "max-w-lg": "md",
  "max-w-xl": "md",
  "max-w-2xl": "lg",
  "max-w-3xl": "lg",
  "max-w-4xl": "xl",
  "max-w-5xl": "xl",
};

// Institute portal modal — a thin wrapper over the shared Dialog (§4.7) so
// focus handling, Esc and the phone sheet layout are consistent everywhere.
const Modal = ({ title, onClose, children, maxWidth = "max-w-2xl", footer, busy }) => (
  <Dialog open title={title} onClose={onClose} size={SIZE_FROM_WIDTH[maxWidth] || "lg"} footer={footer} busy={busy}>
    {children}
  </Dialog>
);

export default Modal;
