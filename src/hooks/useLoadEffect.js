import { useEffect } from "react";

/**
 * Runs an async page loader on mount and whenever the loader changes (i.e.
 * when the useCallback dependencies it was built with change). Loaders passed
 * here must only set state after awaiting their request, so no state change
 * happens synchronously inside the effect.
 */
export function useLoadEffect(...loaders) {
  useEffect(() => {
    loaders.forEach((load) => load());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, loaders);
}
