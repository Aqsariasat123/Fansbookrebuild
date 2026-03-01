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

function ExpandableItem({ item }: { item: AdminNavItem }) {
  const location = useLocation();
  const isChildActive = item.children?.some((c) => location.pathname.startsWith(c.to)) ?? false;
  const [open, setOpen] = useState(isChildActive);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-[#f8f8f8] text-[20px] font-normal"
      >
        <span className="flex items-center gap-[8px]">
          {item.icon && (
            <img src={iconMap[item.icon]} alt="" className="size-[20px] object-contain" />
          )}
          {item.label}
        </span>
        <img
          src="/icons/admin/arrow-drop-down.svg"
          alt=""
          className={`size-[24px] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="ml-[28px] mt-[12px] flex flex-col gap-[16px]">
          {item.children?.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                isActive
                  ? 'rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[10px] py-[8px] text-[16px] font-normal text-[#f8f8f8] shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)]'
                  : 'px-[10px] py-[8px] text-[16px] font-normal text-[#f8f8f8] hover:text-white'
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

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[355px] shrink-0 flex-col overflow-y-auto bg-[#15191c] lg:flex">
      <div className="px-[40px] pt-[40px]">
        <img
          src="/icons/admin/logo.png"
          alt="Fansbook"
          className="h-[56px] w-[205px] object-contain"
        />
      </div>
      <nav className="mt-[40px] flex flex-1 flex-col gap-[30px] px-[30px]">
        {adminNavItems.map((item) =>
          item.children ? (
            <ExpandableItem key={item.to} item={item} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? 'flex w-[295px] items-center gap-[8px] rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[10px] py-[10px] text-[20px] font-normal text-[#f8f8f8] shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)]'
                  : 'flex items-center gap-[8px] text-[20px] font-normal text-[#f8f8f8] hover:text-white'
              }
            >
              {item.icon && (
                <img src={iconMap[item.icon]} alt="" className="size-[20px] object-contain" />
              )}
              {item.label}
            </NavLink>
          ),
        )}
      </nav>
    </aside>
  );
}
