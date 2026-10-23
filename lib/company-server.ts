import fs from 'fs';
import path from 'path';
import { CompanyProblem } from './company-problems-data';

export function getCompanyProblemsServer(slug: string): CompanyProblem[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'companies', `${slug.toLowerCase()}.json`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as CompanyProblem[];
    }
  } catch (e) {
    console.error(`Error loading company data for ${slug}:`, e);
  }
  return [];
}
