import { createContext, useContext } from "react";

export const ConfirmContext = createContext(async () => false);

/** Returns `confirm(options) => Promise<boolean>`; see ConfirmProvider. */
export const useConfirm = () => useContext(ConfirmContext);
