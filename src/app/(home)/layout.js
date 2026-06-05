import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { getSession } from '@/lib/middleware';

export default async function MarketingLayout({ children }) {
  const session = await getSession();

  return (
    <>
      <Navbar session={session} />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}
