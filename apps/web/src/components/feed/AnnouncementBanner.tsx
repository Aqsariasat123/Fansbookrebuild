import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface Announcement {
  id: string;
  title: string;
  content: string;
}

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    api
      .get('/announcements')
      .then(({ data: r }) => {
        const items = r.data || [];
        if (items.length > 0) setAnnouncement(items[0]);
      })
      .catch(() => {});
  }, []);

  if (!announcement || dismissed) return null;

  return (
    <div className="relative rounded-[12px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[12px] text-white">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-[12px] top-[8px] text-white/70 hover:text-white"
      >
        ✕
      </button>
      <p className="text-[14px] font-semibold">{announcement.title}</p>
      <p className="mt-[4px] text-[12px] text-white/90">{announcement.content}</p>
    </div>
  );
}
