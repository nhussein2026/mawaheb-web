import React from "react";
import { formatDate } from "../../utils/format";

// Personal courses and certificates, shared by the scholarship student
// portal and the institute student portal. Both endpoints are scoped to the
// signed-in student and keep any field they don't receive, hence `patch`.

const IMAGE_ACCEPT = "image/jpeg,image/png,image/gif,image/webp";
const IMAGE_HINT = "JPG أو PNG أو GIF أو WebP، حتى 5 ميغابايت";
const IMAGE_TYPE_ERROR = "صيغة الملف غير مدعومة. يُرجى اختيار صورة JPG أو PNG أو GIF أو WebP.";

// Images live on Cloudinary; older records hold a bare filename that no
// longer resolves, so those show the placeholder instead.
const remoteImage = (url) => (/^https?:\/\//i.test(url || "") ? url : null);

const isIssued = (c) => c.source === "issued";

export const courseConfig = {
  endpoint: "/courses",
  patch: true,
  pick: (d) => d.course,
  fields: [
    { name: "title", label: "اسم الدورة", required: true },
    { name: "description", label: "وصف الدورة", type: "textarea", hint: "الجهة المنظِّمة، المدة، وما تعلّمته" },
    { name: "course_image", label: "صورة الدورة أو شهادتها", type: "file", accept: IMAGE_ACCEPT, hint: IMAGE_HINT, typeError: IMAGE_TYPE_ERROR },
  ],
  image: (it) => remoteImage(it.course_image),
  copy: {
    title: "الدورات التدريبية",
    description: "الدورات التدريبية التي التحقت بها.",
    noun: "الدورة",
    add: "إضافة دورة",
    empty: "لا توجد دورات بعد",
    emptyHint: "أضف الدورات التدريبية التي أكملتها لتظهر في سجلك.",
  },
};

export const certificateConfig = {
  endpoint: "/certificates",
  patch: true,
  // Create returns { certificate }, update returns { updatedCertificate }.
  pick: (d) => d.certificate || d.updatedCertificate,
  fields: [
    { name: "title", label: "اسم الشهادة", required: true },
    { name: "description", label: "الجهة المانحة أو وصف الشهادة", type: "textarea" },
    { name: "certificate_link", label: "رابط التحقق من الشهادة", type: "url", hint: "مثال: https://example.com/verify/123" },
    { name: "certificate_image", label: "صورة الشهادة", type: "file", accept: IMAGE_ACCEPT, hint: IMAGE_HINT, typeError: IMAGE_TYPE_ERROR },
  ],
  image: (it) => remoteImage(it.certificate_image),
  link: (it) => it.certificate_link || null,
  // Certificates issued by the institute are read-only (PUT/DELETE → 403).
  readOnly: isIssued,
  date: (it) => (isIssued(it) ? it.issuedAt || it.createdAt : it.createdAt),
  details: (it) =>
    isIssued(it) ? (
      <div className="space-y-0.5 text-xs text-text-tertiary">
        {it.certTitleEn && it.certTitleEn !== it.title ? (
          <p dir="ltr" className="text-start">
            {it.certTitleEn}
          </p>
        ) : null}
        {it.serial ? (
          <p>
            رقم الشهادة <bdi className="font-mono">{it.serial}</bdi>
          </p>
        ) : null}
        {it.issuedAt ? (
          <p>
            تاريخ الإصدار <span className="num">{formatDate(it.issuedAt)}</span>
          </p>
        ) : null}
      </div>
    ) : null,
  copy: {
    title: "الشهادات",
    description: "الشهادات المهنية التي أضفتها والشهادات الصادرة لك عن المعهد.",
    noun: "الشهادة",
    add: "إضافة شهادة",
    empty: "لا توجد شهادات بعد",
    emptyHint: "أضف شهاداتك المهنية مع رابط التحقق إن وُجد.",
    readOnlyBadge: "صادرة عن المعهد",
    forbidden: "لا يمكن تعديل الشهادات الصادرة عن المعهد أو حذفها.",
  },
};
