import React from "react";
import StatCard from "./StatCard";

// Renders a responsive row of StatCards from an array of
// { label, value, icon, tone } — used at the top of every module page.
const StatGrid = ({ stats = [], cols = 4 }) => {
  const gridCols =
    {
      2: "sm:grid-cols-2",
      3: "sm:grid-cols-2 lg:grid-cols-3",
      4: "sm:grid-cols-2 lg:grid-cols-4",
    }[cols] || "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid grid-cols-1 gap-4 ${gridCols}`}>
      {stats.map((s, i) => (
        <StatCard
          key={s.key || i}
          label={s.label}
          value={s.value}
          icon={s.icon}
          tone={s.tone}
        />
      ))}
    </div>
  );
};

export default StatGrid;
