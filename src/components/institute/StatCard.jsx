import React from "react";
import { StatTile } from "../ui/StatTile";

// Metric tile used across dashboards and module headers (§4.7 "Stat tile").
// `tone` is kept for call-site compatibility; tiles stay neutral because a
// value's color only carries meaning in the comparison line.
// eslint-disable-next-line no-unused-vars
const StatCard = ({ label, value, icon, tone, to, hint, trend }) => (
  <StatTile label={label} value={value} icon={icon} to={to} hint={hint} trend={trend} />
);

export default StatCard;
