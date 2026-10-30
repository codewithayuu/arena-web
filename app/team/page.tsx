import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { TeamPage } from '@/components/team/TeamPage';

export const metadata: Metadata = {
  title: 'Team | Mindflare',
  description:
    'Meet the team behind Mindflare, the official IT department society focused on DSA and competitive programming.',
};

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[#0D0D10] text-[#F2F2EE] font-sans selection:bg-[#E5322D]/30 selection:text-[#F2F2EE] flex flex-col">
      <Navbar />
      <div className="flex-1">
        <TeamPage />
      </div>
      <Footer />
    </div>
  );
}
