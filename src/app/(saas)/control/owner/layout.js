import Link from 'next/link';
import { isOwner } from '@/lib/middleware';
import { redirect } from 'next/navigation';
import ClientDashboardLayout from '@/components/dashboard/ClientDashboardLayout';

export default async function OwnerLayout({ children }) {
  const auth = await isOwner();
  if (!auth.success) redirect('/login');
  const session = auth.data;

  return (
    <ClientDashboardLayout session={session} panelType="owner" title="SaaS Control Panel">
      {children}
    </ClientDashboardLayout>
  );
}
