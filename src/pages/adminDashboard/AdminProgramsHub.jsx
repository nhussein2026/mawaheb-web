import React from "react";
import { useSelector } from "react-redux";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatTile, StatTiles } from "../../components/ui/StatTile";
import { SkeletonTiles } from "../../components/ui/Feedback";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";

const HUBS = [
  { key: "courses", title: "الدورات", path: "/courses", href: "/student/courses" },
  { key: "events", title: "الفعاليات", path: "/events", href: "/student/events" },
  { key: "certificates", title: "الشهادات", path: "/certificates", href: "/student/certificates" },
  { key: "notes", title: "الملاحظات", path: "/notes", href: "/notes" },
  { key: "difficulties", title: "الصعوبات", path: "/difficulties", href: "/student/difficulties" },
];

// Record counts per content type; each tile opens the screen that manages it.
// A count that could not be loaded shows "—" with a note, never a zero.
export default function AdminProgramsHub() {
  const token = useSelector((state) => state.auth.token);

  const { data: counts, status } = useResource(
    async () => {
      const results = await Promise.all(
        HUBS.map(async (h) => {
          try {
            const res = await fetch(`${API_BASE_URL}${h.path}`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) return [h.key, null];
            const data = await res.json();
            return [h.key, Array.isArray(data) ? data.length : null];
          } catch {
            return [h.key, null];
          }
        })
      );
      return Object.fromEntries(results);
    },
    [token],
    { initial: {}, select: (d) => d }
  );

  return (
    <div className="space-y-6">
      <PageHeader title="البرامج والمحتوى" description="عدد السجلات في كل نوع من المحتوى. افتح أي بطاقة لإدارته." />
      {status === "loading" ? (
        <SkeletonTiles count={5} />
      ) : (
        <StatTiles cols={5}>
          {HUBS.map((h) => (
            <StatTile
              key={h.key}
              label={h.title}
              value={counts[h.key] == null ? "—" : counts[h.key]}
              hint={counts[h.key] == null ? "تعذّر التحميل" : "سجل"}
              to={h.href}
            />
          ))}
        </StatTiles>
      )}
    </div>
  );
}
