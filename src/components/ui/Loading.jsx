import React from "react";
import { Sparkles } from "lucide-react";

export const Loading = ({ fullPage = false, text = "جاري التحميل..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 shadow-sm animate-bounce">
          <Sparkles size={32} />
        </div>
        <div className="absolute -inset-2 rounded-2xl border-2 border-accent-200 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-bold text-brand-800 tracking-wide">{text}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-surface-page flex items-center justify-center z-[100]">
        {content}
      </div>
    );
  }

  return <div className="py-20 flex justify-center w-full">{content}</div>;
};

export const Skeleton = ({ className }) => (
  <div className={`skeleton ${className}`}></div>
);
