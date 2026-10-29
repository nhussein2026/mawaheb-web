import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Load data for a page and expose its state, so a failed load is shown in
 * the page with Retry instead of a toast (§4.8).
 *
 *   const { data, status, reload } = useResource(() => api.list(year), [year]);
 *   status: "loading" | "ready" | "failed"; `error` holds the last failure
 *
 * After the first load, reloads keep the previous data visible; `reload`
 * (for Retry buttons) shows the loading state again only after a failure.
 */
export function useResource(fetcher, deps = [], { initial = null, select = (res) => res?.data?.data } = {}) {
  const [data, setData] = useState(initial);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  const selectRef = useRef(select);
  const seq = useRef(0);

  useEffect(() => {
    fetcherRef.current = fetcher;
    selectRef.current = select;
  });

  // Fetch and store the result. State changes only when the result arrives,
  // so data from the previous load stays visible meanwhile (§4.8).
  const run = useCallback(async () => {
    const id = ++seq.current;
    try {
      const res = await fetcherRef.current();
      if (id !== seq.current) return;
      setData(selectRef.current(res) ?? initial);
      setError(null);
      setStatus("ready");
    } catch (err) {
      if (id === seq.current) {
        setError(err);
        setStatus("failed");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Retry / refresh from an event handler: show loading again only after a failure.
  const reload = useCallback(() => {
    setStatus((s) => (s === "failed" ? "loading" : s));
    return run();
  }, [run]);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, status, error, reload, setData };
}

export default useResource;
