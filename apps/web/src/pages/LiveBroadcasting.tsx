import { useState } from 'react';

interface ChatMsg {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  isMine: boolean;
}

const DEMO_MESSAGES: ChatMsg[] = [
  {
    id: '1',
    user: 'Johny Wirk',
    avatar: '/icons/dashboard/person.svg',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '',
    isMine: false,
  },
  {
    id: '2',
    user: 'Me',
    avatar: '',
    text: 'Lorem Ipsum is simply dummy text.',
    time: '10:11 am',
    isMine: true,
  },
];

export default function LiveBroadcasting() {
  const [messages] = useState<ChatMsg[]>(DEMO_MESSAGES);
  const [msgInput, setMsgInput] = useState('');

  return (
    <div className="flex flex-col gap-[20px]">
      {/* About */}
      <div>
        <p className="text-[18px] font-semibold text-foreground">About Live Stream</p>
        <p className="mt-[8px] text-[14px] text-[#a0a0a0]">
          Lorem ipsum is a simply dummy text for printing.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-2">
        {/* Video Panel */}
        <div className="overflow-hidden rounded-[16px] border border-[#e91e8c]">
          <div className="flex items-center justify-between bg-[#e91e8c] px-[20px] py-[10px]">
            <p className="text-[16px] font-semibold text-white">Video Broadcasting</p>
            <button className="rounded-[8px] bg-white px-[20px] py-[6px] text-[14px] font-medium text-[#e91e8c]">
              Leave
            </button>
          </div>
          <div className="relative flex aspect-video items-center justify-center bg-[#0a0c0e]">
            <div className="flex flex-col items-center gap-[8px]">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              <p className="text-[14px] text-muted-foreground">Live stream preview</p>
            </div>
            <div className="absolute right-[16px] top-[16px] rounded-[4px] bg-black/60 px-[10px] py-[4px] text-[14px] text-white">
              2.12k
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex flex-col overflow-hidden rounded-[16px] border border-[#e91e8c]">
          {/* Chat Header */}
          <div className="flex items-center justify-between bg-[#e91e8c] px-[20px] py-[10px]">
            <div className="flex items-center gap-[10px]">
              <img src="/icons/dashboard/person.svg" alt="" className="size-[32px] rounded-full" />
              <p className="text-[14px] font-medium text-white">Johny Wirk</p>
            </div>
            <div className="flex items-center gap-[10px]">
              <button className="flex items-center gap-[6px] rounded-[20px] border border-white px-[12px] py-[4px] text-[12px] text-white">
                Go Private <span className="text-yellow-400">&#x1F4B0;</span> 1
              </button>
              <div className="flex items-center gap-[4px] rounded-[20px] bg-white/20 px-[12px] py-[4px] text-[12px] text-white">
                <span className="text-yellow-400">&#x1F4B0;</span> 83.00
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            className="flex flex-1 flex-col gap-[16px] bg-card p-[16px]"
            style={{ minHeight: 250 }}
          >
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.isMine ? 'justify-end' : 'justify-start'}`}>
                {!m.isMine && (
                  <div className="flex gap-[10px]">
                    <img src={m.avatar} alt="" className="size-[32px] shrink-0 rounded-full" />
                    <div>
                      <p className="mb-[4px] text-[12px] font-medium text-foreground">{m.user}</p>
                      <div className="rounded-[12px] bg-[#2a2d30] px-[14px] py-[10px]">
                        <p className="text-[13px] text-foreground">{m.text}</p>
                      </div>
                    </div>
                  </div>
                )}
                {m.isMine && (
                  <div className="flex flex-col items-end">
                    <p className="mb-[4px] text-[10px] text-[#e91e8c]">{m.time}</p>
                    <div className="rounded-[12px] bg-[#2a2d30] px-[14px] py-[10px]">
                      <p className="text-[13px] text-foreground">{m.text}</p>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#01adf1"
                      className="mt-[2px]"
                    >
                      <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex items-center gap-[10px] border-t border-[#2a2d30] bg-card px-[16px] py-[10px]">
            <button>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </button>
            <input
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              placeholder="Message"
              className="flex-1 bg-transparent text-[14px] text-foreground placeholder-muted-foreground outline-none"
            />
            <button>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </button>
            <button>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
              </svg>
            </button>
            <button className="flex size-[36px] items-center justify-center rounded-full bg-[#01adf1]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
