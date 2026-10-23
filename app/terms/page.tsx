import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | Mindflare Arena",
  description: "Terms for using Mindflare Arena learning and practice features.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These draft terms describe the expected use of Mindflare Arena’s learning and practice experience. The Mindflare owner should review and approve them before they are treated as final legal terms."
      sections={[
        { title: "Using the service", body: "Mindflare Arena provides learning materials, topic lists, practice tools, and account features. By using the service, you agree to use it lawfully and to follow any additional rules shown for a specific feature or event." },
        { title: "Accounts", body: "You are responsible for keeping access to your account secure and for activity performed through it. Account sign-in is provided by Clerk. The current sign-up flow is limited to people who confirm they are at least 18 years old." },
        { title: "Learning content and user submissions", body: "You may use the learning materials for personal study. You keep ownership of notes and other material you create. Do not submit content that you do not have the right to share, or use the service to distribute harmful, unlawful, or infringing material." },
        { title: "Educational use", body: "Practice questions, explanations, progress indicators, and other learning features are provided for study. They do not guarantee a particular result, qualification, or interview outcome. You remain responsible for reviewing and validating material before relying on it." },
        { title: "Availability and changes", body: "Features may be updated, temporarily unavailable, or removed as the service develops. Where an activity has separate rules, those rules apply to that activity." },
        { title: "Suspension and termination", body: "The service owner may restrict access when needed to protect the service, its members, or the rights of others. Account deletion and associated application data are handled through the account controls and applicable service processes." },
        { title: "Contact and legal review", body: "These terms are a product draft, not legal advice. The service owner must add any required operating entity, contact details, governing law, dispute process, and jurisdiction before publication as final terms." },
      ]}
    />
  );
}
