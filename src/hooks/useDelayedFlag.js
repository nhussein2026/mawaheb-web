import { useEffect, useState } from "react";

// Skeletons are shown only after 300 ms so fast loads do not flicker (§4.8).
export function useDelayedFlag(active, delay = 300) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!active) return undefined;
    const t = setTimeout(() => setShow(true), delay);
    return () => {
      clearTimeout(t);
      setShow(false);
    };
  }, [active, delay]);
  return active && show;
}

