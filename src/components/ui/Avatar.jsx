import React, { useState } from "react";
import { cn } from "../../utils/cn";

const SIZES = {
  24: "size-6 text-xs",
  32: "size-8 text-xs",
  40: "size-10 text-sm",
  56: "size-14 text-lg",
  64: "size-16 text-xl",
  96: "size-24 text-3xl",
};

// Two initials; Arabic letters are separated by a zero-width non-joiner so
// they do not join into a word (§4.6).
function initialsOf(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "؟";
  const first = parts[0][0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return [first, last].filter(Boolean).join("‌").toUpperCase();
}

// Rounded-square avatar (28%): photo or an initials tile in brand.subtle.
export function Avatar({ name, src, size = 32, className }) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center overflow-hidden rounded-[28%] bg-brand-subtle font-display font-bold leading-none text-brand-text",
        SIZES[size] || SIZES[32],
        className
      )}
      aria-hidden={name ? undefined : true}
      title={name || undefined}
    >
      {showImg ? (
        <img
          src={src}
          alt=""
          className="size-full object-cover"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        <span aria-hidden="true">{initialsOf(name)}</span>
      )}
      {name ? <span className="sr-only">{name}</span> : null}
    </span>
  );
}

export default Avatar;
