import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#15191c] font-outfit">
      <Navbar />
      <div className="flex gap-[22px] px-[26px] pt-[22px]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
