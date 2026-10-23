import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Mindflare Arena",
  description: "How Mindflare Arena uses account and learning data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This draft summarizes the data flows currently used by the web application. The Mindflare owner should confirm providers, retention periods, contact details, and legal requirements before publishing it as a final policy."
      sections={[
        { title: "Information used by the service", body: "When you create an account, Clerk handles authentication. The web application stores account-linked profile details and learning state such as progress, lesson bookmarks, notebook entries, and topic-list activity in Supabase. Topic comments, comment votes, and private practice problem notes use the configured Neon database." },
        { title: "Active member presence", body: "When a signed-in browser is open, it sends a periodic presence heartbeat. The home page may show your profile display name, handle, and profile image to other visitors while your presence is active. The active list hides a member after two minutes without a heartbeat. Presence records older than 30 days are opportunistically removed during a later signed-in heartbeat; the owner should review this behavior and its wording before publishing a final retention policy." },
        { title: "How information is used", body: "Account and learning data supports sign-in, saved progress and notes, bookmarks, community features, and service reliability. Presence is used to show which members are currently active. This page does not claim that data is used for advertising or automated account decisions." },
        { title: "Service providers", body: "The application currently integrates Clerk for identity, Supabase for application profile and learning data, and Neon for selected comments and practice notes. Hosting, delivery, and other infrastructure providers may process technical request data as part of operating the service. The owner should maintain a complete provider and subprocessors list before this policy is final." },
        { title: "Your choices and requests", body: "You can control whether you sign in and use account features. You can edit or delete notebook entries through the notebook interface. Account deletion is handled by the account lifecycle process; contact the Mindflare team through its official channels for data access or deletion requests. Browser-only guest notes remain on that device until removed from the browser." },
        { title: "Security and retention", body: "The application uses server-side access checks for account data and keeps database service credentials on the server. No online service can promise absolute security. The owner must define retention periods for account, request, and presence data and verify that deployed providers match this draft." },
        { title: "Policy updates and review", body: "This policy may change as the application and its providers change. This draft still needs owner and legal review, including applicable rights, lawful bases, international transfers, cookie disclosures, and the correct contact and supervisory authority details." },
      ]}
    />
  );
}
