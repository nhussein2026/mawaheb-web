import React, { useCallback, useRef, useState } from "react";
import { ConfirmDialog } from "./Dialog";
import { ConfirmContext } from "./confirmContext";

/**
 * App-wide confirmation dialog (§4.8 "Confirmation tiers"). Pages call
 *
 *   const confirm = useConfirm();
 *   if (!(await confirm({ title: "حذف الإعلان؟", body: "…", confirmLabel: "حذف الإعلان", destructive: true }))) return;
 *
 * Title is the action as a question, body states the consequence, the button
 * names the action. Destructive dialogs open with focus on Cancel.
 */
export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback(
    (options) =>
      new Promise((resolve) => {
        resolver.current = resolve;
        setState(options);
      }),
    []
  );

  const settle = (value) => {
    resolver.current?.(value);
    resolver.current = null;
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state ? (
        <ConfirmDialog
          open
          title={state.title}
          confirmLabel={state.confirmLabel || "تأكيد"}
          destructive={state.destructive}
          typedConfirmation={state.typedConfirmation}
          onConfirm={() => settle(true)}
          onClose={() => settle(false)}
        >
          {state.body ? <p>{state.body}</p> : null}
        </ConfirmDialog>
      ) : null}
    </ConfirmContext.Provider>
  );
}

export default ConfirmProvider;
