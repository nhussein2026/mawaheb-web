import React, { useState } from "react";
import { ArrowRight, Send, Paperclip, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { selectCls, labelCls, textareaCls } from "./formStyles";

const dt = (d) => (d ? new Date(d).toLocaleString("ar") : "—");

const Attachments = ({ items = [] }) =>
  items.length ? (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((a, i) => (
        <a
          key={i}
          href={a.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-xs text-brand-600 hover:bg-neutral-200"
        >
          <Paperclip className="h-3 w-3" /> مرفق {i + 1}
        </a>
      ))}
    </div>
  ) : null;

const Bubble = ({ authorName, at, body, attachments }) => (
  <div className="rounded-lg border-[0.5px] border-border-subtle p-3">
    <div className="mb-1 flex items-center gap-2 text-xs text-text-muted">
      <User className="h-3.5 w-3.5" />
      <span className="font-medium text-text-secondary">{authorName || "—"}</span>
      <span>· {dt(at)}</span>
    </div>
    <p className="whitespace-pre-wrap text-sm text-text-primary">{body}</p>
    <Attachments items={attachments} />
  </div>
);

// Reusable thread detail (spec §5/§9): opener + replies log + reply box +
// status control. `statusOptions` is [{value,label}]; omit to hide the control.
const ThreadView = ({ thread, messages = [], statusOptions, onReply, onSetStatus, onBack, busy }) => {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);

  const send = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    await onReply(body, files);
    setBody("");
    setFiles([]);
    // reset the native file input
    e.target.reset?.();
  };

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
        <ArrowRight className="h-4 w-4" /> العودة للقائمة
      </button>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">{thread.subject}</CardTitle>
          {statusOptions && (
            <select
              className={`${selectCls} w-auto`}
              value={thread.status}
              onChange={(e) => onSetStatus(e.target.value)}
              disabled={busy}
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {thread.moduleTag && (
            <span className="inline-block rounded-full bg-accent-50 px-2 py-0.5 text-xs text-accent-700">
              [{thread.moduleTag}]
            </span>
          )}
          <Bubble authorName={thread.author?.name} at={thread.createdAt} body={thread.body} attachments={thread.attachments} />

          {messages.length > 0 && (
            <>
              <p className="pt-2 text-sm font-medium text-text-secondary">💬 سجل الردود والمناقشات السابقة</p>
              {messages.map((m) => (
                <Bubble key={m._id} authorName={m.author?.name} at={m.createdAt} body={m.body} attachments={m.attachments} />
              ))}
            </>
          )}

          <form onSubmit={send} className="space-y-2 border-t-[0.5px] border-border-subtle pt-3">
            <label className={labelCls}>الرد</label>
            <textarea className={textareaCls} rows={2} value={body} onChange={(e) => setBody(e.target.value)} />
            <div className="flex items-center justify-between gap-2">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="text-xs text-text-secondary"
              />
              <Button type="submit" disabled={busy}>
                <Send className="h-4 w-4" /> إرسال الرد
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreadView;
