import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { controlCls } from "./controlStyles";

/**
 * Search field (§4.7): magnifier at inline-start, clear button at inline-end,
 * Esc clears. Wrap in a <form> to search on Enter, or pass `onChange` for
 * as-you-type filtering.
 */
export function SearchInput({ value, onChange, onClear, label = "بحث", placeholder, className, inputClassName, ...props }) {
  const clear = () => {
    onChange?.({ target: { value: "" } });
    onClear?.();
  };
  return (
    <div className={cn("relative min-w-0", className)}>
      <Search
        className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-text-tertiary"
        aria-hidden="true"
      />
      <input
        type="search"
        aria-label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault();
            clear();
          }
        }}
        className={cn(controlCls, "h-10 pe-9 ps-9 [&::-webkit-search-cancel-button]:hidden", inputClassName)}
        {...props}
      />
      {value ? (
        <button
          type="button"
          onClick={clear}
          aria-label="مسح البحث"
          title="مسح البحث"
          className="absolute inset-y-0 end-1 my-auto grid size-8 place-items-center rounded-md text-text-tertiary hover:bg-subtle hover:text-text-primary"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export default SearchInput;
