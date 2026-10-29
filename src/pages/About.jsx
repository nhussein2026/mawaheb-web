import React from "react";

// Public reading page: one column of reading text (max 68ch), Kufi section
// titles with the short gold rule used on public pages (§4.1).
const sections = [
  {
    title: "من نحن",
    body: "مؤسسة مواهب مؤسسة يمنية غير ربحية تأسست عام 2010 بترخيص رقم 387 من وزارة الشؤون الاجتماعية والعمل، ومقرها المكلا بمحافظة حضرموت، ويمتد نطاق عملها إلى اليمن كله.",
  },
  {
    title: "رسالتنا",
    body: "اكتشاف الطلاب الموهوبين والمتفوقين ورعايتهم وتنمية قدراتهم من خلال التدريب والتأهيل والتوعية.",
  },
  {
    title: "برامجنا",
    list: [
      "معهد حضرموت للموهوبين: برنامج لثلاث سنوات بالتوازي مع المرحلة الثانوية، يشمل رعاية سكنية كاملة وتدريبًا مسائيًا.",
      "برنامج التأهيل والابتعاث: منح جامعية خارجية للمتميزين من خريجي المعهد تغطي الرسوم والسكن والمعيشة والسفر.",
      "اثنا عشر برنامجًا تدريبيًا، منها القيادة والابتكار والروبوتات والذكاء الاصطناعي والحاسوب واللغة الإنجليزية والمناظرات.",
    ],
  },
  {
    title: "قيمنا",
    list: ["التنمية", "المعيارية", "الإبداع", "الشراكة", "الجودة"],
  },
];

const AboutPage = () => (
  <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-16">
    <h1 className="font-display text-heading-1 text-text-primary sm:text-display-md">عن مؤسسة مواهب</h1>
    <div className="mt-8 space-y-10 sm:mt-12">
      {sections.map((s) => (
        <section key={s.title} className="reading">
          <h2 className="font-display text-heading-2 text-text-primary after:mt-2 after:block after:h-[3px] after:w-8 after:rounded-sm after:bg-brand-accent after:content-['']">
            {s.title}
          </h2>
          {s.body ? <p className="mt-4 text-body-lg text-text-secondary">{s.body}</p> : null}
          {s.list ? (
            <ul className="mt-4 list-disc space-y-2 ps-6 text-body-lg text-text-secondary marker:text-text-tertiary">
              {s.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  </div>
);

export default AboutPage;
