import React from "react";
import { Link } from "react-router-dom";
import { SystemPage } from "../components/ui/SystemPage";

const linkCls =
  "inline-flex h-10 items-center rounded-md border px-4 text-sm font-semibold transition-colors";

const NotFound = () => (
  <SystemPage
    code="404"
    title="لم نعثر على هذه الصفحة"
    description="ربما نُقلت الصفحة أو كُتب العنوان بشكل غير صحيح. يُرجى التحقق من العنوان أو العودة إلى الصفحة الرئيسية."
  >
    <button
      type="button"
      onClick={() => window.history.back()}
      className={`${linkCls} border-border-control bg-surface text-text-primary hover:bg-subtle`}
    >
      رجوع
    </button>
    <Link to="/" className={`${linkCls} border-transparent bg-brand-strong text-brand-on-strong hover:bg-brand-strong-hover`}>
      الصفحة الرئيسية
    </Link>
  </SystemPage>
);

export default NotFound;
