import { isSupport } from '@/lib/middleware';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';

export default async function SupportLayout({ children }) {
  const auth = await isSupport();
  if (!auth.success) redirect('/login');
  const session = auth.data;

  return (
    <div className="flex h-screen bg-bg text-text overflow-hidden">
      <Sidebar session={session} panelType="support" />
      <main className="flex-1 flex flex-col overflow-hidden bg-bg">
        <Navbar title="Support Agent Panel" />
        <div className="flex-1 p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
