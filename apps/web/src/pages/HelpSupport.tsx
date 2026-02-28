import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { ReportForm } from '../components/help/ReportForm';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

function ArrowIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 10.5L12 14.5L16 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HelpSupport() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/support/faqs')
      .then(({ data: r }) => {
        if (r.success) setFaqs(r.data);
      })
      .catch(() => {})
      .finally(() => setLoadingFaqs(false));
  }, []);

  function toggleFaq(id: string) {
    setOpenFaq((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] text-foreground">Help &amp; Support</p>

      <div className="flex flex-col rounded-[22px] bg-card px-[20px] py-[20px]">
        {/* ── FAQ's Section ── */}
        <div className="flex flex-col gap-[16px]">
          <p className="text-[16px] text-foreground">FAQ&apos;s</p>

          {loadingFaqs ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          ) : faqs.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">No FAQs available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-[12px] md:grid-cols-2">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-muted rounded-[8px] p-[10px] cursor-pointer"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <div className="flex items-center justify-between gap-[8px]">
                    <p className="text-[12px] text-muted-foreground flex-1">{faq.question}</p>
                    <ArrowIcon open={openFaq === faq.id} />
                  </div>
                  {openFaq === faq.id && (
                    <p className="text-[12px] text-foreground mt-[8px] leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="bg-muted h-px w-full my-[20px]" />

        {/* ── Report a Problem Section ── */}
        <ReportForm />
      </div>
    </div>
  );
}
