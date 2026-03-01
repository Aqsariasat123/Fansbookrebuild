import { useState } from 'react';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { CTASection, MarketingFooter } from '../components/marketing/MarketingFooter';
import { api } from '../lib/api';

const WHITE = 'brightness(0) invert(1)';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/contact', { name, email, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-outfit">
      {/* Hero Section — 355px */}
      <div className="relative h-[280px] md:h-[355px]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/contact/hero-bg.webp"
            alt=""
            className="absolute left-0 w-full max-w-none"
            style={{ height: '240.21%', top: '-40.77%' }}
          />
          <div className="absolute inset-0 bg-[rgba(21,25,28,0.9)]" />
        </div>
        <MarketingNav />
        <div className="absolute inset-x-0 top-[100px] px-[20px] md:top-[135px] md:px-0 flex flex-col items-center gap-[14px] text-white">
          <h1 className="text-center text-[30px] md:text-[48px] font-medium">Contact FansBook</h1>
          <p className="text-center text-[10px] md:text-[20px] font-normal">
            Got a question or just wanna talk? We&apos;re here for it.
          </p>
        </div>
      </div>

      {/* Contact Form — dark bg */}
      <div className="min-h-0 w-full overflow-hidden bg-muted px-[20px] md:px-0">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-[986px] flex-col items-center gap-[40px] pt-[40px] pb-[40px] md:pt-[70px] md:pb-[70px]"
        >
          {/* Success message */}
          {success && (
            <div className="w-full rounded-[12px] border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-[14px] text-green-400">
              Message sent successfully! We&apos;ll get back to you soon.
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="w-full rounded-[12px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-[14px] text-red-400">
              {error}
            </div>
          )}

          <div className="flex w-full flex-col items-start gap-[15px] rounded-[16px] bg-card p-[20px] md:rounded-[22px] md:p-[32px]">
            {/* Name */}
            <div className="flex w-full flex-col items-start">
              <div className="px-[15px] py-[10px]">
                <label className="text-[12px] md:text-[20px] font-normal text-foreground">
                  Name
                </label>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name..."
                required
                className="w-full rounded-[7px] md:rounded-[12px] bg-muted py-[12px] md:py-[25px] pl-[15px] text-[12px] md:text-[20px] font-normal text-foreground placeholder-muted-foreground outline-none"
              />
            </div>

            {/* Email */}
            <div className="flex w-full flex-col items-start">
              <div className="px-[15px] py-[10px]">
                <label className="text-[12px] md:text-[20px] font-normal text-foreground">
                  Email
                </label>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email..."
                required
                className="w-full rounded-[7px] md:rounded-[12px] bg-muted py-[12px] md:py-[25px] pl-[15px] text-[12px] md:text-[20px] font-normal text-foreground placeholder-muted-foreground outline-none"
              />
            </div>

            {/* Message */}
            <div className="flex w-full flex-col items-start">
              <div className="px-[15px] py-[10px]">
                <label className="text-[12px] md:text-[20px] font-normal text-foreground">
                  Message
                </label>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write message..."
                required
                className="h-[100px] md:h-[152px] w-full resize-none rounded-[7px] md:rounded-[12px] bg-muted py-[12px] md:py-[25px] pl-[15px] text-[12px] md:text-[20px] font-normal text-foreground placeholder-muted-foreground outline-none"
              />
            </div>
          </div>

          {/* Send button — gradient pill */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-[10px] rounded-[49px] md:rounded-[80px] px-[18px] py-[9px] md:px-[30px] md:py-[15px] text-[12px] md:text-[20px] font-medium text-white shadow-[0px_6px_10.1px_rgba(34,34,34,0.25)] disabled:opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(-90deg, rgb(166, 22, 81) 0%, rgb(1, 173, 241) 100%)',
            }}
          >
            {loading ? 'Sending...' : 'Send Message'}
            <img
              src="/icons/landing/arrow_forward.svg"
              alt=""
              className="h-[15px] w-[15px] md:h-[24px] md:w-[24px]"
              style={{ filter: WHITE }}
            />
          </button>
        </form>
      </div>

      {/* CTA + Footer — same as landing page */}
      <CTASection />
      <MarketingFooter />
    </div>
  );
}
