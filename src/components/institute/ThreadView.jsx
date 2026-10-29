import React, { useState } from "react";
import { ChevronRight, Send, Paperclip } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Field, Select, Textarea, Input } from "../ui/Input";
import { Avatar } from "../ui/Avatar";
import { Chip } from "../ui/Badge";
import { formatDateTime, formatRelative } from "../../utils/format";

const Attachments = ({ items = [] }) =>
  items.length ? (
    <ul className="mt-2 flex flex-wrap gap-2">
      {items.map((a, i) => (
        <li key={i}>
          <a
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-sm bg-subtle px-2.5 text-xs font-semibold text-brand-strong underline-offset-4 hover:underline"
          >
            <Paperclip className="size-4" aria-hidden="true" /> مرفق {i + 1}
            <span className="sr-only">(يفتح في نافذة جديدة)</span>
          </a>
        </li>
      ))}
    </ul>
  ) : null;

// One message: who, when (relative under 7 days), and the text.
const Bubble = ({ authorName, at, body, attachments }) => (
  <article className="flex gap-3 rounded-lg border border-border-default p-3 sm:p-4">
    <Avatar name={authorName} size={32} />
    <div className="min-w-0 flex-1">
      <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
        <span className="font-semibold text-text-primary">{authorName || "—"}</span>
        <time dateTime={at} title={formatDateTime(at)} className="num text-xs text-text-tertiary">
          {formatRelative(at)}
        </time>
      </p>
      <p dir="auto" className="mt-1 whitespace-pre-wrap text-sm text-text-primary">
        {body}
      </p>
      <Attachments items={attachments} />
    </div>
  </article>
);

// Reusable thread detail: opener + replies + reply box + status control.
// `statusOptions` is [{value,label}]; omit to hide the control.
const ThreadView = ({ thread, messages = [], statusOptions, onReply, onSetStatus, onBack, busy }) => {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const send = async (e) => {
    e.preventDefault();
    if (!body.trim()) {
      setError("يُرجى كتابة نص الرد");
      document.getElementById("thread-reply")?.focus();
      return;
    }
    setError("");
    await onReply(body, files);
    setBody("");
    setFiles([]);
    e.target.reset?.();
  };

  return (
    <div className="space-y-4">
      <Button variant="tertiary" size="sm" onClick={onBack} className="-ms-2">
        <ChevronRight aria-hidden="true" /> العودة إلى القائمة
      </Button>

      <Card>
        <CardHeader
          actions={
            statusOptions ? (
              <Select
                aria-label="حالة المحادثة"
                className="w-auto"
                value={thread.status}
                onChange={(e) => onSetStatus(e.target.value)}
                disabled={busy}
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            ) : null
          }
        >
          <CardTitle dir="auto">{thread.subject}</CardTitle>
          {thread.moduleTag ? <Chip className="mt-1">{thread.moduleTag}</Chip> : null}
        </CardHeader>
        <CardContent className="space-y-3">
          <Bubble authorName={thread.author?.name} at={thread.createdAt} body={thread.body} attachments={thread.attachments} />

          {messages.length > 0 ? (
            <section aria-label="الردود" className="space-y-3">
              <h3 className="pt-2 text-heading-4 text-text-secondary">الردود</h3>
              {messages.map((m) => (
                <Bubble key={m._id} authorName={m.author?.name} at={m.createdAt} body={m.body} attachments={m.attachments} />
              ))}
            </section>
          ) : null}

          <form onSubmit={send} noValidate className="space-y-3 border-t border-border-subtle pt-4">
            <Field label="الرد" error={error} id="thread-reply">
              <Textarea
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  if (error && e.target.value.trim()) setError("");
                }}
                dir="auto"
              />
            </Field>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <Field label="المرفقات" hint="PDF أو JPG أو PNG" id="thread-files" className="min-w-0 flex-1">
                <Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
              </Field>
              <Button type="submit" loading={busy}>
                <Send className="icon-dir" aria-hidden="true" /> إرسال الرد
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreadView;
