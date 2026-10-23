import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CompanyProblemsView } from '@/components/practice/company-problems-view';
import { COMPANIES, getCompanyBySlug } from '@/lib/company-problems-data';
import { getCompanyProblemsServer } from '@/lib/company-server';

interface PageProps {
  params: Promise<{
    company: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { company } = await params;
  const companyInfo = getCompanyBySlug(company);
  const companyName = companyInfo ? companyInfo.name : company.toUpperCase();

  return {
    title: `${companyName} Top Interview Problems | Mindflare Arena`,
    description: `Practice the most frequently asked coding interview problems at ${companyName} with LeetCode links and interactive code editor.`,
  };
}

export async function generateStaticParams() {
  return COMPANIES.map((c) => ({
    company: c.slug,
  }));
}

export default async function CompanyPracticePage({ params }: PageProps) {
  const { company } = await params;
  const initialProblems = getCompanyProblemsServer(company);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 pt-20">
        <CompanyProblemsView
          currentCompanySlug={company}
          initialProblems={initialProblems}
        />
      </div>
      <Footer />
    </div>
  );
}
