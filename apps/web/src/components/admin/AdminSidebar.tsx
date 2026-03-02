import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { adminNavItems, type AdminNavItem } from './adminNavItems';

const iconMap: Record<string, string> = {
  dashboard: '/icons/admin/finance.png',
  person: '/icons/admin/user.png',
  booking: '/icons/admin/booking.png',
  earnings: '/icons/admin/transaction.png',
  report: '/icons/admin/report.png',
  audit: '/icons/admin/report.png',
  finance: '/icons/admin/finance.png',
  masters: '/icons/admin/masters.png',
  settings: '/icons/admin/settings.png',
};

function ExpandableItem({ item, onNav }: { item: AdminNavItem; onNav?: () => void }) {
  const location = useLocation();
  const isChildActive = item.children?.some((c) => location.pathname.startsWith(c.to)) ?? false;
  const [open, setOpen] = useState(isChildActive);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-[#f8f8f8] text-[16px] font-normal lg:text-[20px]"
      >
        <span className="flex items-center gap-[8px]">
          {item.icon && (
            <img
              src={iconMap[item.icon]}
              alt=""
              className="size-[18px] object-contain lg:size-[20px]"
            />
          )}
          {item.label}
        </span>
        <img
          src="/icons/admin/arrow-drop-down.svg"
          alt=""
          className={`size-[20px] transition-transform lg:size-[24px] ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="ml-[26px] mt-[10px] flex flex-col gap-[12px] lg:ml-[28px] lg:mt-[12px] lg:gap-[16px]">
          {item.children?.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={onNav}
              className={({ isActive }) =>
                isActive
                  ? 'rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[10px] py-[6px] text-[14px] font-normal text-[#f8f8f8] shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)] lg:py-[8px] lg:text-[16px]'
                  : 'px-[10px] py-[6px] text-[14px] font-normal text-[#f8f8f8] hover:text-white lg:py-[8px] lg:text-[16px]'
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: Props) {
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-[24px] pt-[24px] lg:px-[40px] lg:pt-[40px]">
        <img
          src="/icons/admin/logo.png"
          alt="Fansbook"
          className="h-[40px] w-[150px] object-contain lg:h-[56px] lg:w-[205px]"
        />
        {/* Close button - mobile only */}
        <button onClick={onClose} className="text-white lg:hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
      <nav className="mt-[24px] flex flex-1 flex-col gap-[20px] px-[20px] pb-[24px] lg:mt-[40px] lg:gap-[30px] lg:px-[30px]">
        {adminNavItems.map((item) =>
          item.children ? (
            <ExpandableItem key={item.to} item={item} onNav={onClose} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-[8px] rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[10px] py-[8px] text-[16px] font-normal text-[#f8f8f8] shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)] lg:w-[295px] lg:py-[10px] lg:text-[20px]'
                  : 'flex items-center gap-[8px] text-[16px] font-normal text-[#f8f8f8] hover:text-white lg:text-[20px]'
              }
            >
              {item.icon && (
                <img
                  src={iconMap[item.icon]}
                  alt=""
                  className="size-[18px] object-contain lg:size-[20px]"
                />
              )}
              {item.label}
            </NavLink>
          ),
        )}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[355px] shrink-0 flex-col overflow-y-auto bg-[#15191c] lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile overlay drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="relative z-10 flex h-full w-[280px] flex-col overflow-y-auto bg-[#15191c]">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
