import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted font-outfit">
      <Navbar onMenuToggle={() => setSidebarOpen(true)} />
      <div className="flex gap-0 px-[16px] pt-[16px] lg:gap-[22px] lg:px-[26px] lg:pt-[22px]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-6">
          <Outlet />
        </main>
      </div>
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
