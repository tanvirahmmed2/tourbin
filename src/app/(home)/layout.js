import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { getSession } from '@/lib/middleware';

export default async function MarketingLayout({ children }) {
  const session = await getSession();

  return (
    <>
      <Navbar session={session} />
      <main className="pt-14">{children}</main>
      <Footer />
    </>
  );
}
