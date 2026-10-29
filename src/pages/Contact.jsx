import React from "react";
import { ExternalLink } from "lucide-react";

const Contact = () => (
  <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-16">
    <h1 className="font-display text-heading-1 text-text-primary sm:text-display-md">تواصل معنا</h1>
    <p className="reading mt-4 text-body-lg text-text-secondary">
      يسعدنا تواصلك مع مؤسسة مواهب. للاستفسارات العامة وبيانات التواصل المحدّثة، يُرجى زيارة الموقع الرسمي للمؤسسة.
    </p>
    <a
      href="https://mawaheb.org"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex h-12 items-center gap-2 rounded-md bg-brand-strong px-6 text-base font-semibold text-brand-on-strong hover:bg-brand-strong-hover"
    >
      زيارة mawaheb.org
      <ExternalLink className="icon-dir size-5" aria-hidden="true" />
      <span className="sr-only">(يفتح في نافذة جديدة)</span>
    </a>
  </div>
);

export default Contact;
