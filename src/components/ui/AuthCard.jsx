import React from "react";
import { Link } from "react-router-dom";
import foundationLogo from "../../assets/logo/drklogo.webp";

/**
 * Sign-in layout (§5.1): a centered 400 px card on bg.canvas with the
 * Foundation logo and no marketing content.
 */
export function AuthCard({ title, description, children, footer }) {
  return (
    <div className="flex min-h-[calc(100dvh-8rem)] items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="rounded-xl border border-border-default bg-surface px-5 py-7 sm:px-8">
          <Link to="/" className="mx-auto block w-fit rounded-md" aria-label="مؤسسة مواهب — الرئيسية">
            <img src={foundationLogo} alt="مؤسسة مواهب" width="56" height="62" className="h-16 w-auto" />
          </Link>
          <h1 className="mt-5 text-center font-display text-heading-2 text-text-primary">{title}</h1>
          {description ? <p className="mt-1 text-center text-sm text-text-secondary">{description}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
        {footer ? <div className="mt-4 text-center text-sm text-text-secondary">{footer}</div> : null}
      </div>
    </div>
  );
}

export const authLinkCls = "font-semibold text-brand-strong underline underline-offset-4 hover:text-brand-strong-hover";

export default AuthCard;
