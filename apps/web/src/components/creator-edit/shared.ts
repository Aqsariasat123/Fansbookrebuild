import { api } from '../../lib/api';

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Toast {
  type: 'success' | 'error';
  message: string;
}

export const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Toronto',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'Europe/Rome',
  'Europe/Amsterdam',
  'Europe/Stockholm',
];

export const SOCIAL_PLATFORMS = ['Instagram', 'Twitter', 'TikTok', 'YouTube', 'Website'];

export const COUNTRIES_LIST = [
  'US',
  'UK',
  'Germany',
  'France',
  'Canada',
  'Australia',
  'India',
  'China',
  'Japan',
  'Brazil',
  'Russia',
  'Turkey',
];

export const inputClass =
  'w-full h-[46px] rounded-[6px] border border-muted-foreground bg-transparent px-[12px] text-[13px] font-extralight text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-[#01adf1]';

export const selectClass =
  'w-full h-[46px] rounded-[6px] border border-muted-foreground bg-transparent px-[12px] text-[13px] font-extralight text-foreground outline-none transition-colors focus:border-[#01adf1] appearance-none cursor-pointer';

export const textareaClass =
  'w-full rounded-[6px] border border-muted-foreground bg-transparent px-[12px] py-[14px] text-[13px] font-extralight text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-[#01adf1] resize-none';

export const labelClass = 'text-[20px] font-medium text-foreground capitalize';

export const saveButtonClass =
  'w-full max-w-[306px] h-[45px] rounded-[80px] bg-gradient-to-l from-[#a61651] to-[#01adf1] text-[20px] text-foreground shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)] hover:opacity-90 transition-opacity disabled:opacity-50';

export const cancelButtonClass =
  'w-full max-w-[306px] h-[45px] rounded-[80px] border border-[#2e4882] bg-secondary text-[20px] text-foreground shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)] hover:opacity-90 transition-opacity';

export function extractError(err: unknown): string {
  const axErr = err as { response?: { data?: { error?: string } } };
  return axErr?.response?.data?.error ?? 'Something went wrong';
}

export { api };
