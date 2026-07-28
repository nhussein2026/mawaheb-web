// Shared form control classes for the institute portal, so pages stop
// re-declaring the same Tailwind strings (matches Members/YearsStudents).
export const selectCls =
  "flex h-9 w-full rounded-md border-[0.5px] border-border-default bg-neutral-50 px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600";

export const labelCls = "mb-1 block text-xs font-medium text-text-secondary";

export const textareaCls = `${selectCls} h-auto py-2`;
