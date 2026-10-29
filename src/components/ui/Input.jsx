import React, { useId } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "../../utils/cn";
import { controlCls } from "./controlStyles";

// Form fields (§4.7). Default: white fill, 1 px border.control, radius-md,
// 40 px tall, 16 px text. Focus: 2 px brand.strong border + ring. Invalid:
// 2 px danger border with a linked message. Labels always sit above fields.

export const Input = React.forwardRef(({ className, type = "text", error, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    aria-invalid={error ? true : props["aria-invalid"]}
    className={cn(controlCls, "h-10", type === "file" && "h-auto py-2 text-sm", className)}
    {...props}
  />
));
Input.displayName = "Input";

export const Select = React.forwardRef(({ className, error, children, ...props }, ref) => (
  <select
    ref={ref}
    aria-invalid={error ? true : props["aria-invalid"]}
    className={cn(controlCls, "h-10 cursor-pointer pe-8", className)}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export const Textarea = React.forwardRef(({ className, error, rows = 3, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    aria-invalid={error ? true : props["aria-invalid"]}
    className={cn(controlCls, "min-h-[88px] resize-y py-2 leading-7", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({ className, required, children, ...props }) {
  return (
    <label className={cn("block text-label-md text-text-primary", className)} {...props}>
      {children}
      {required ? (
        <span className="ms-0.5 text-danger-700" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}

/**
 * Field anatomy: label → hint → error → control → counter.
 * The child control receives id, aria-describedby and aria-invalid.
 */
export function Field({ label, hint, error, required, className, children, id: idProp, count, max }) {
  const autoId = useId();
  const id = idProp || autoId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const control = React.isValidElement(children)
    ? React.cloneElement(children, {
        id: children.props.id || id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required: children.props.required ?? required,
      })
    : children;
  return (
    <div className={cn("grid content-start gap-1", className)}>
      {label ? (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      ) : null}
      {hint ? (
        <p id={hintId} className="text-caption text-text-tertiary">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-label-sm text-danger-700">
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
      {control}
      {max ? (
        <p className="num text-end text-caption text-text-tertiary" aria-live="polite">
          {count ?? 0} / {max}
        </p>
      ) : null}
    </div>
  );
}

// Shown once at the top of forms that have required fields (§4.7).
export function RequiredNote({ className }) {
  return (
    <p className={cn("text-caption text-text-tertiary", className)}>
      الحقول المعلّمة بـ <span className="text-danger-700">*</span> مطلوبة
    </p>
  );
}
