import { redirect } from "next/navigation";

// The old Guides hub was a mockup with no articles behind it. Guides now live
// as real journal posts (tagged "guides"), so this route forwards home.
export default function GuidesRedirect() {
  redirect("/");
}
