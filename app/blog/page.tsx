import { redirect } from "next/navigation";

// The Journal now lives at the site root ("/"). This route just forwards any
// /blog visits there so old links keep working and we avoid duplicate content.
export default function BlogIndexRedirect() {
  redirect("/");
}
