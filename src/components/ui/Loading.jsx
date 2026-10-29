import React from "react";
import { Spinner, SkeletonPage, SkeletonRows } from "./Feedback";
import { useDelayedFlag } from "../../hooks/useDelayedFlag";

/**
 * Loading states (§4.8):
 *   < 300 ms   nothing, to avoid flicker
 *   300 ms+    skeletons shaped like the final content
 * There is never a full-viewport spinner; the shell stays visible.
 *
 *   <Loading />                    page skeleton (header, tiles, card)
 *   <Loading variant="inline" />   list skeleton inside a card or panel
 *   <Loading variant="spinner" />  small spinner for buttons and rows
 */
const Loading = ({ variant = "page", message }) => {
  const show = useDelayedFlag(true);
  if (variant === "spinner") return <Spinner label={message || "جارٍ التحميل"} />;
  if (!show) return <span className="sr-only" role="status">{message || "جارٍ التحميل…"}</span>;
  if (variant === "inline") {
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">{message || "جارٍ التحميل…"}</span>
        {message ? <p className="px-4 pt-4 text-sm text-text-tertiary">{message}</p> : null}
        <SkeletonRows rows={5} />
      </div>
    );
  }
  return <SkeletonPage label={message} />;
};

export default Loading;
export { Spinner as SpinnerLoader };
