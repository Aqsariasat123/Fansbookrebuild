import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#ddd] font-outfit">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto px-[26px] py-[20px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
