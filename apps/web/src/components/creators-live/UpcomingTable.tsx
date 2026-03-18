import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatScheduledTime } from './Dropdown';

interface UpcomingLiveItem {
  id: string;
  creatorId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  title: string;
  description: string | null;
  category: string | null;
  thumbnail: string | null;
  scheduledAt: string;
}

interface ConfirmTarget {
  sessionId: string;
  creatorId: string;
  username: string;
  title: string;
  scheduledAt: string;
}

export function UpcomingTable({ upcoming }: { upcoming: UpcomingLiveItem[] | undefined }) {
  const navigate = useNavigate();
  const [notified, setNotified] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<ConfirmTarget | null>(null);
  const [alreadyNotified, setAlreadyNotified] = useState<string | null>(null); // username

  async function doNotify(sessionId: string, creatorId: string) {
    setConfirm(null);
    setLoading((prev) => new Set(prev).add(sessionId));
    try {
      await api.post(`/followers/${creatorId}`);
      setNotified((prev) => new Set(prev).add(sessionId));
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        navigate('/login');
        return;
      }
      if (status === 409) setNotified((prev) => new Set(prev).add(sessionId));
    } finally {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }
  }

  return (
    <>
      {/* Upcoming Lives Section */}
      <div className="mt-[30px] flex flex-col items-center gap-[5px] px-[20px] text-foreground md:mt-[60px] md:gap-[11px]">
        <h2 className="text-center text-[24px] font-normal md:text-[48px]">Upcoming Lives</h2>
        <p className="text-center text-[15px] font-normal md:text-[16px]">
          Don't miss out! Get notified when your favorite creators go live.
        </p>
      </div>

      {/* Upcoming Lives Table */}
      <div className="flex justify-center px-[16px] pt-[30px] pb-[60px] md:px-[40px] md:pt-[40px] md:pb-[80px] lg:px-[86px]">
        <div className="w-full max-w-[1108px] overflow-hidden rounded-[22px] bg-card">
          {/* Table Header */}
          <div className="relative px-[16px] pt-[16px] md:px-[60px] md:pt-[52px] lg:px-[161px]">
            <div className="flex items-center">
              <span className="flex-1 text-center font-outfit text-[12px] font-medium text-foreground md:text-[16px]">
                Creator
              </span>
              <span className="flex-1 text-center font-outfit text-[12px] font-medium text-foreground md:text-[16px]">
                Time
              </span>
              <span className="flex-1 text-center font-outfit text-[12px] font-medium text-foreground md:text-[16px]">
                Action
              </span>
            </div>
            <div className="mx-auto mt-[10px] h-px w-full bg-muted-foreground md:mt-[14px]" />
          </div>

          {/* Table Rows */}
          <div className="px-[16px] pt-[12px] pb-[20px] md:px-[60px] md:pt-[20px] md:pb-[46px] lg:px-[161px]">
            {upcoming && upcoming.length > 0 ? (
              upcoming.map((item) => (
                <div key={item.id} className="flex items-center py-[12px] md:py-[20px]">
                  <div className="flex flex-1 items-center justify-center gap-[8px] md:gap-[17px]">
                    <div className="h-[20px] w-[20px] shrink-0 overflow-hidden rounded-full bg-muted md:h-[38px] md:w-[38px]">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[8px] font-bold text-muted-foreground md:text-[14px]">
                          {item.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="font-outfit text-[12px] font-normal text-foreground md:text-[16px]">
                      @{item.username}
                    </span>
                  </div>
                  <div className="flex-1 text-center font-outfit text-[12px] font-normal text-foreground md:text-[16px]">
                    {formatScheduledTime(item.scheduledAt)}
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <button
                      onClick={() =>
                        notified.has(item.id)
                          ? setAlreadyNotified(item.username)
                          : setConfirm({
                              sessionId: item.id,
                              creatorId: item.creatorId,
                              username: item.username,
                              title: item.title,
                              scheduledAt: item.scheduledAt,
                            })
                      }
                      disabled={loading.has(item.id)}
                      className={`flex items-center gap-[5px] rounded-[4px] border p-[5px] transition-colors md:gap-[10px] md:p-[10px] disabled:opacity-50 ${notified.has(item.id) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground'}`}
                    >
                      <img
                        src="/icons/creators/notification_add.svg"
                        alt=""
                        className="h-[10px] w-[10px] md:h-[20px] md:w-[20px]"
                      />
                      <span className="font-outfit text-[12px] font-normal md:text-[16px]">
                        {notified.has(item.id) ? 'Notified ✓' : 'Notify me'}
                      </span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-[40px] text-center font-outfit text-[16px] text-muted-foreground">
                No upcoming lives scheduled.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Already notified popup */}
      {alreadyNotified && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[16px]"
          onClick={() => setAlreadyNotified(null)}
        >
          <div
            className="w-full max-w-[340px] rounded-[16px] bg-card p-[24px] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-[12px] flex size-[48px] items-center justify-center rounded-full bg-primary/10">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#01adf1"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3 className="mb-[6px] text-[16px] font-semibold text-foreground">
              Already Notified!
            </h3>
            <p className="mb-[20px] text-[13px] text-muted-foreground">
              You're already following{' '}
              <span className="font-medium text-foreground">@{alreadyNotified}</span> and will be
              notified when they go live.
            </p>
            <button
              onClick={() => setAlreadyNotified(null)}
              className="w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-medium text-white hover:opacity-90"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Confirmation popup */}
      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[16px]"
          onClick={() => setConfirm(null)}
        >
          <div
            className="w-full max-w-[380px] rounded-[16px] bg-card p-[24px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-[8px] text-[18px] font-semibold text-foreground">Get Notified?</h3>
            <p className="mb-[4px] text-[14px] text-muted-foreground">
              You'll follow <span className="font-medium text-foreground">@{confirm.username}</span>{' '}
              and get notified when their live starts.
            </p>
            <p className="mb-[20px] text-[13px] font-medium text-foreground">
              "{confirm.title}" —{' '}
              {new Date(confirm.scheduledAt).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <div className="flex gap-[10px]">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 rounded-[50px] border border-border py-[10px] text-[14px] text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => doNotify(confirm.sessionId, confirm.creatorId)}
                className="flex-1 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-medium text-white hover:opacity-90"
              >
                Yes, Notify me
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
