import type { Metadata } from "next";
import { ProfilesDesk } from "@/components/ProfilesDesk";

export const metadata: Metadata = {
  title: "Profiles · Signified",
  description:
    "People and labelled agent profiles. An agent reading is not evidence.",
};

export default function ProfilesPage() {
  return (
    <div className="folio is-issue is-field">
      <ProfilesDesk />
    </div>
  );
}
