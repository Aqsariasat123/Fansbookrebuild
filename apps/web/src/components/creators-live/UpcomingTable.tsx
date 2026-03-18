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

export function UpcomingTable({ upcoming }: { upcoming: UpcomingLiveItem[] | undefined }) {
  const navigate = useNavigate();
  const [notified, setNotified] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<Set<string>>(new Set());

  async function handleNotify(creatorId: string) {
    if (notified.has(creatorId) || loading.has(creatorId)) return;
    setLoading((prev) => new Set(prev).add(creatorId));
    try {
      await api.post(`/followers/${creatorId}`);
      setNotified((prev) => new Set(prev).add(creatorId));
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        navigate('/login');
        return;
      }
      if (status === 409) setNotified((prev) => new Set(prev).add(creatorId)); // already following
    } finally {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(creatorId);
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
                  {/* Creator */}
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

                  {/* Time */}
                  <div className="flex-1 text-center font-outfit text-[12px] font-normal text-foreground md:text-[16px]">
                    {formatScheduledTime(item.scheduledAt)}
                  </div>

                  {/* Action */}
                  <div className="flex flex-1 items-center justify-center">
                    <button
                      onClick={() => handleNotify(item.creatorId)}
                      disabled={loading.has(item.creatorId)}
                      className={`flex items-center gap-[5px] rounded-[4px] border p-[5px] transition-colors md:gap-[10px] md:p-[10px] disabled:opacity-50 ${
                        notified.has(item.creatorId)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-foreground'
                      }`}
                    >
                      <img
                        src="/icons/creators/notification_add.svg"
                        alt=""
                        className="h-[10px] w-[10px] md:h-[20px] md:w-[20px]"
                      />
                      <span className="font-outfit text-[12px] font-normal md:text-[16px]">
                        {notified.has(item.creatorId) ? 'Notified ✓' : 'Notify me'}
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
    </>
  );
}
