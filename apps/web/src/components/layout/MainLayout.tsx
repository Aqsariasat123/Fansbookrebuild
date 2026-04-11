import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { IncomingCallModal } from '../call/IncomingCallModal';
import { FloatingChatBubble } from '../chat/FloatingChatBubble';
import { SupportChatWidget } from '../SupportChatWidget';
import { useNotificationSocket } from '../../hooks/useNotificationSocket';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useNotificationSocket();

  return (
    <div className="min-h-screen overflow-x-hidden bg-muted font-outfit">
      <Navbar onMenuToggle={() => setSidebarOpen(true)} />
      <div className="flex gap-0 px-[16px] pt-[16px] lg:gap-[22px] lg:px-[26px] lg:pt-[22px]">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-6">
          <Outlet />
        </main>
      </div>
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <IncomingCallModal />
      <FloatingChatBubble />
      <SupportChatWidget />
    </div>
  );
}
