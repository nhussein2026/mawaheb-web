import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { SystemPage } from "../components/ui/SystemPage";
import { homePathFor } from "../utils/roles";

const linkCls =
  "inline-flex h-10 items-center rounded-md border px-4 text-sm font-semibold transition-colors";

// 403 (§5.3): what happened, who can grant access, and a way forward.
const Forbidden = ({ grantedBy = "مدير النظام" }) => {
  const user = useSelector((s) => s.auth?.user);
  return (
    <SystemPage
      standalone
      code="403"
      title="لا تملك صلاحية الوصول إلى هذه الصفحة"
      description={`يمكن لـ${grantedBy} منحك الصلاحية إن كنت تحتاج إليها في عملك.`}
    >
      <button
        type="button"
        onClick={() => window.history.back()}
        className={`${linkCls} border-border-control bg-surface text-text-primary hover:bg-subtle`}
      >
        رجوع
      </button>
      <Link
        to={homePathFor(user)}
        className={`${linkCls} border-transparent bg-brand-strong text-brand-on-strong hover:bg-brand-strong-hover`}
      >
        صفحتي الرئيسية
      </Link>
    </SystemPage>
  );
};

export default Forbidden;
