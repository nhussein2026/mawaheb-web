import React, { useState } from "react";
import { toast } from "react-toastify";
import { PenSquare, Paperclip, ChevronLeft } from "lucide-react";
import { PageHeader } from "../ui/PageHeader";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { Field, Input, Textarea, RequiredNote } from "../ui/Input";
import { Callout, EmptyState, SkeletonRows } from "../ui/Feedback";
import { StatusBadge, Chip } from "../ui/Badge";
import ThreadView from "./ThreadView";
import { useResource } from "../../hooks/useResource";
import instituteApi from "../../services/api/instituteApi";
import { threadStatusLabel, THREAD_STATUS_TONE } from "../../constants/institute";
import { formatRelative } from "../../utils/format";

const FORM_ID = "new-thread-form";

/**
 * A student's own threads (correspondence or bug reports): list, open a
 * thread to read and reply, and start a new one in a dialog.
 * `copy` holds the wording that differs between the two pages.
 */
export function MyThreads({ loadList, create, copy, withModuleTag = false }) {
  const { data: rows, status, reload } = useResource(loadList, [], { initial: [] });
  const [open, setOpen] = useState(null);
  const [openError, setOpenError] = useState("");
  const [composing, setComposing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ subject: "", body: "", moduleTag: "" });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const openThread = async (id) => {
    setOpenError("");
    try {
      const res = await instituteApi.getMyThread(id);
      setOpen(res.data?.data || null);
    } catch {
      setOpenError(copy.openFailed);
    }
  };

  const closeCompose = () => {
    setComposing(false);
    setErrors({});
    setFormError("");
  };

  const send = async (e) => {
    e.preventDefault();
    const found = {};
    if (!form.subject.trim()) found.subject = "يُرجى إدخال الموضوع";
    if (!form.body.trim()) found.body = copy.bodyRequired;
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) {
      document.getElementById(found.subject ? "thread-subject" : "thread-body")?.focus();
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      files.forEach((f) => fd.append("attachments", f));
      await create(fd);
      toast.success(copy.sent);
      setForm({ subject: "", body: "", moduleTag: "" });
      setFiles([]);
      closeCompose();
      reload();
    } catch {
      setFormError(copy.sendFailed);
    } finally {
      setBusy(false);
    }
  };

  const reply = async (body, replyFiles) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("body", body);
      (replyFiles || []).forEach((f) => fd.append("attachments", f));
      await instituteApi.replyMyThread(open.thread._id, fd);
      await openThread(open.thread._id);
      reload();
    } catch {
      toast.error("تعذّر إرسال الرد. يُرجى المحاولة مرة أخرى.");
    } finally {
      setBusy(false);
    }
  };

  if (open) {
    return (
      <div className="space-y-6">
        <PageHeader title={copy.title} />
        <ThreadView thread={open.thread} messages={open.messages} onReply={reply} onBack={() => setOpen(null)} busy={busy} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={copy.title}
        description={copy.description}
        actions={
          <Button onClick={() => setComposing(true)}>
            <PenSquare aria-hidden="true" /> {copy.newLabel}
          </Button>
        }
      />

      {openError ? <Callout tone="danger">{openError}</Callout> : null}

      <Card>
        {status === "loading" ? (
          <SkeletonRows rows={4} />
        ) : status === "failed" ? (
          <EmptyState kind="failed" title={copy.listFailed} onRetry={reload} />
        ) : rows.length === 0 ? (
          <EmptyState
            kind="first-use"
            title={copy.empty}
            action={<Button onClick={() => setComposing(true)}>{copy.newLabel}</Button>}
          />
        ) : (
          <ul className="divide-y divide-border-subtle">
            {rows.map((t) => (
              <li key={t._id}>
                <button
                  type="button"
                  onClick={() => openThread(t._id)}
                  className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-start hover:bg-neutral-50 sm:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span dir="auto" className="font-semibold text-text-primary">
                        {t.subject}
                      </span>
                      {t.moduleTag ? <Chip>{t.moduleTag}</Chip> : null}
                      {t.attachments?.length ? (
                        <Paperclip className="size-4 text-text-tertiary" aria-label="فيها مرفقات" />
                      ) : null}
                    </p>
                    <p className="num mt-0.5 text-xs text-text-tertiary">آخر نشاط {formatRelative(t.lastMessageAt)}</p>
                  </div>
                  <StatusBadge tone={THREAD_STATUS_TONE[t.status]}>{threadStatusLabel(t.status)}</StatusBadge>
                  <ChevronLeft className="size-4 shrink-0 text-text-tertiary" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Dialog
        open={composing}
        onClose={closeCompose}
        title={copy.newLabel}
        busy={busy}
        footer={
          <>
            <Button variant="secondary" onClick={closeCompose} disabled={busy}>
              إلغاء
            </Button>
            <Button type="submit" form={FORM_ID} loading={busy}>
              {copy.sendLabel}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} onSubmit={send} noValidate className="space-y-4">
          {formError ? <Callout tone="danger">{formError}</Callout> : null}
          <RequiredNote />
          <Field label="الموضوع" required error={errors.subject} id="thread-subject">
            <Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} dir="auto" />
          </Field>
          {withModuleTag ? (
            <Field label="القسم أو الوحدة" hint="مثال: النتائج الدراسية" id="thread-module">
              <Input value={form.moduleTag} onChange={(e) => setForm((f) => ({ ...f, moduleTag: e.target.value }))} />
            </Field>
          ) : null}
          <Field label={copy.bodyLabel} required error={errors.body} id="thread-body">
            <Textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} dir="auto" rows={4} />
          </Field>
          <Field label="المرفقات" hint="JPG أو PNG أو PDF، حتى 5 ميغابايت لكل ملف" id="thread-files">
            <Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
          </Field>
        </form>
      </Dialog>
    </div>
  );
}

export default MyThreads;
