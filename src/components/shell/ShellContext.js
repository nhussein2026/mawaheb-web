import { createContext, useContext } from "react";

// What the current page sits under: the shell's section (breadcrumb root),
// the matched navigation item, and the brand scope of the content area.
export const ShellContext = createContext({
  section: null,
  current: null,
  scope: "foundation",
  scopeLabel: null,
});

export const useShell = () => useContext(ShellContext);
