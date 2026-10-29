import React, { Suspense } from "react";
import Loading from "../components/ui/Loading";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";

// Public pages: Foundation identity on the warm public background.
const PublicLayout = () => (
  <div className="flex min-h-dvh flex-col bg-public text-text-primary" dir="rtl" lang="ar" data-scope="foundation">
    <a
      href="#main"
      className="sr-only z-[1500] rounded-md bg-surface px-4 py-2 text-sm font-semibold text-brand-strong focus:not-sr-only focus:fixed focus:start-4 focus:top-3"
    >
      تخطي إلى المحتوى
    </a>
    <Header />
    <main id="main" tabIndex={-1} className="flex-1 outline-none">
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </main>
    <footer className="border-t border-border-default bg-surface">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-text-tertiary sm:px-6">
        <p>مؤسسة مواهب · المكلا، حضرموت</p>
        <a
          href="https://mawaheb.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-strong underline underline-offset-4"
        >
          mawaheb.org
        </a>
      </div>
    </footer>
  </div>
);

export default PublicLayout;
