import { redirect } from "next/navigation";

export default function LegacyAdminContestsRedirect() {
  redirect("/operations/contest-management");
}
