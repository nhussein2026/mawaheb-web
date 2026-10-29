import React from "react";
import { StatTile, StatTiles } from "../ui/StatTile";

// Renders a responsive row of stat tiles from an array of
// { label, value, icon, to?, hint?, trend? } — used at the top of module pages.
const StatGrid = ({ stats = [], cols = 4 }) => (
  <StatTiles cols={cols}>
    {stats.map((s, i) => (
      <StatTile
        key={s.key || i}
        label={s.label}
        value={s.value}
        icon={s.icon}
        to={s.to}
        hint={s.hint}
        trend={s.trend}
      />
    ))}
  </StatTiles>
);

export default StatGrid;
