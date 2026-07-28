import React from "react";
import { Card, CardContent } from "../ui/Card";

// Compact metric tile used across the institute dashboard and module headers.
const StatCard = ({ label, value, icon: Icon, tone = "brand" }) => {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    accent: "bg-accent-50 text-accent-600",
    success: "bg-success-bg text-success-text",
    neutral: "bg-neutral-100 text-neutral-700",
    danger: "bg-error-bg text-error-text",
  };
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-secondary">{label}</p>
            <h3 className="mt-1 text-2xl font-bold text-text-primary">{value}</h3>
          </div>
          {Icon && (
            <div className={`shrink-0 rounded-xl p-3 ${tones[tone] || tones.brand}`}>
              <Icon size={22} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
