'use client';

import React, { useRef, useState } from 'react';
import { LayoutGroup } from 'motion/react';
import { CouncilRow } from './CouncilRow';
import { TeamAccordion } from './TeamAccordion';
import {
  getTeamSections,
  getTechnicalHead,
  getExecutive,
  getHeadOfOperations,
} from '@/data/team';

/**
 * TeamPage component for Mindflare.
 *
 * Uses the default website sans-serif typography (Plus Jakarta Sans).
 * Council includes President, Vice President, General Secretary, Executive,
 * Technical Head, and Head of Operations.
 * Head of Operations slides to Media & Creative as a member when it opens.
 * All members have visible images, and team leaders have bigger images.
 */
export function TeamPage() {
  const [openTeamId, setOpenTeamId] = useState<string | null>(null);
  const [isHeadOfOperationsMoved, setIsHeadOfOperationsMoved] = useState(false);
  const openTeamIdRef = useRef<string | null>(null);

  const technicalHead = getTechnicalHead();
  const executive = getExecutive();
  const headOfOperations = getHeadOfOperations();
  const allSections = getTeamSections();

  const technicalSections = allSections.filter((s) => s.wing === 'Technical');
  const executiveSections = allSections.filter((s) => s.wing === 'Executive');

  const toggleTeam = (teamId: string) => {
    const next = openTeamId === teamId ? null : teamId;
    openTeamIdRef.current = next;
    setOpenTeamId(next);
    if (openTeamId === 'media&creative' || next !== 'media&creative') {
      setIsHeadOfOperationsMoved(false);
    }
  };

  const handleMediaCreativeExpanded = () => {
    if (openTeamIdRef.current === 'media&creative') {
      setIsHeadOfOperationsMoved(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0D0D10] text-[#F2F2EE] font-sans selection:bg-[#E5322D]/30 selection:text-[#F2F2EE]">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24 lg:py-32 flex flex-col gap-16 sm:gap-24 lg:gap-32 text-left">
        {/* Page Header */}
        <header className="w-full border-b border-white/10 pb-8 sm:pb-12">
          <h1 className="text-5xl sm:text-7xl lg:text-[88px] font-extrabold leading-none tracking-tight text-[#F2F2EE]">
            Team
          </h1>
          <p className="text-base sm:text-lg text-[#8A8A90] mt-4 max-w-2xl font-normal">
            The minds steering Mindflare, advancing competitive programming and algorithm intuition.
          </p>
        </header>

        <LayoutGroup id="team-page">
          {/* Council leadership, with Head of Operations relocating into Media & Creative */}
          <CouncilRow isHeadOfOperationsMoved={isHeadOfOperationsMoved} />

          {/* Organization Wings: Technical & Executive */}
          <section aria-label="Society organization wings" className="w-full">
            <div className="grid grid-cols-12 gap-12 lg:gap-16">
              {/* Technical wing (led by Technical Head) */}
              <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
                <div className="flex flex-col gap-1 pb-4 border-b border-white/10 text-left">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#3DA9FC]">
                    Engineering &amp; Algorithms
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F2EE] leading-tight">
                    Technical
                  </h2>
                  <p className="text-sm font-normal text-[#8A8A90]">
                    Led by {technicalHead.name} ({technicalHead.role})
                  </p>
                </div>

                <div className="flex flex-col" role="region" aria-label="Technical teams">
                  {technicalSections.map((section) => (
                    <TeamAccordion
                      key={section.id}
                      section={section}
                      isOpen={openTeamId === section.id}
                      onToggle={() => toggleTeam(section.id)}
                      onExpanded={handleMediaCreativeExpanded}
                      isHeadOfOperationsMoved={isHeadOfOperationsMoved}
                      headOfOperations={headOfOperations}
                    />
                  ))}
                </div>
              </div>

              {/* Executive wing (led by Executive) */}
              <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
                <div className="flex flex-col gap-1 pb-4 border-b border-white/10 text-left">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#E5322D]">
                    Operations &amp; Creative
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F2EE] leading-tight">
                    Executive
                  </h2>
                  <p className="text-sm font-normal text-[#8A8A90]">
                    Led by {executive.name} ({executive.role})
                  </p>
                </div>

                <div className="flex flex-col" role="region" aria-label="Executive teams">
                  {executiveSections.map((section) => (
                    <TeamAccordion
                      key={section.id}
                      section={section}
                      isOpen={openTeamId === section.id}
                      onToggle={() => toggleTeam(section.id)}
                      onExpanded={handleMediaCreativeExpanded}
                      isHeadOfOperationsMoved={isHeadOfOperationsMoved}
                      headOfOperations={headOfOperations}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </LayoutGroup>
      </main>
    </div>
  );
}
