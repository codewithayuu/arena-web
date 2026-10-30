'use client';

import React from 'react';
import { PersonCard } from './PersonCard';
import {
  getPresident,
  getVicePresident,
  getGeneralSecretary,
  getExecutive,
  getTechnicalHead,
  getHeadOfOperations,
} from '@/data/team';

interface CouncilRowProps {
  isMediaCreativeOpen: boolean;
}

/**
 * CouncilRow component renders council leadership and the Head of Operations.
 */
export function CouncilRow({ isMediaCreativeOpen }: CouncilRowProps) {
  const president = getPresident();
  const vicePresident = getVicePresident();
  const generalSecretary = getGeneralSecretary();
  const executive = getExecutive();
  const technicalHead = getTechnicalHead();
  const headOfOperations = getHeadOfOperations();

  return (
    <section aria-label="Council leadership" className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-white/10 text-left">
        <span className="text-xs uppercase font-bold tracking-wider text-[#E5322D]">
          Core Leadership
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F2EE] tracking-tight">
          Council
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 items-stretch w-full max-w-3xl mx-auto">
        <PersonCard person={president} tier={2} />
        <PersonCard person={vicePresident} tier={2} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 items-stretch">
        <PersonCard person={generalSecretary} tier={2} />
        <PersonCard person={executive} tier={2} />
        <PersonCard person={technicalHead} tier={2} />
        <div className="flex min-h-[300px]">
          {!isMediaCreativeOpen ? (
            <PersonCard
              person={headOfOperations}
              tier={2}
              layoutId="head-of-operations-card"
              isOperationalHead
            />
          ) : (
            <div
              className="w-full h-full min-h-[260px] p-6 border border-dashed border-[#E5322D]/40 bg-[#E5322D]/[0.03] rounded-xl flex flex-col justify-between text-left transition-all duration-300"
              role="status"
              aria-label={`Head of Operations, ${headOfOperations.name}, is currently a member of Media & Creative`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-[#E5322D] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#E5322D] animate-ping" />
                  Vacant Slot
                </span>
                <span className="text-[#8A8A90] font-medium">media &amp; creative</span>
              </div>

              <div className="py-4">
                <p className="text-base font-bold text-[#F2F2EE]">{headOfOperations.name}</p>
                <p className="text-xs text-[#8A8A90] mt-1">
                  Slid to <strong className="text-white">Media &amp; Creative</strong> as a member
                </p>
              </div>

              <p className="text-xs text-[#8A8A90]/70">
                Card currently active in department below ↓
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
