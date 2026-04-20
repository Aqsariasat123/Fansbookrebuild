import { useState } from 'react';
import { api } from '../../lib/api';

const GRAD = 'linear-gradient(-90deg, rgb(166,22,81) 0%, rgb(1,173,241) 100%)';
const WHITE = 'brightness(0) invert(1)';

const inputCls =
  'w-full rounded-[10px] bg-muted px-[14px] py-[12px] text-[14px] text-foreground placeholder-muted-foreground outline-none';

export function ContactForm() {
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
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-[24px]"
    >
      <p className="self-start text-[18px] font-semibold text-foreground">Send us a message</p>

      {success && (
        <div className="w-full rounded-[12px] border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-[14px] text-green-400">
          Message sent! We&apos;ll get back to you soon.
        </div>
      )}
      {error && (
        <div className="w-full rounded-[12px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-[14px] text-red-400">
          {error}
        </div>
      )}

      <div className="flex w-full flex-col gap-[16px] rounded-[20px] bg-card p-[24px] md:p-[32px]">
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium text-foreground">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name..."
            required
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium text-foreground">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email..."
            required
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium text-foreground">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            required
            className={`${inputCls} h-[120px] resize-none`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-[10px] rounded-[49px] px-[24px] py-[12px] text-[15px] font-medium text-white disabled:opacity-60"
        style={{ backgroundImage: GRAD }}
      >
        {loading ? 'Sending...' : 'Send Message'}
        <img
          src="/icons/landing/arrow_forward.svg"
          alt=""
          className="h-[18px] w-[18px]"
          style={{ filter: WHITE }}
        />
      </button>
    </form>
  );
}
