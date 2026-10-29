// Support ticket statuses (backend values) → label and StatusBadge tone.
export const TICKET_STATUS = {
  Open: { label: "مفتوحة", tone: "info" },
  "In Progress": { label: "قيد المعالجة", tone: "warning" },
  Resolved: { label: "تم الحل", tone: "success" },
  Closed: { label: "مغلقة", tone: "neutral" },
};

export const ticketStatus = (s) => TICKET_STATUS[s] || TICKET_STATUS.Open;
