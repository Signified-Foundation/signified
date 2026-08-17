import { redirect } from "next/navigation";

export default function WikiIndexPage() {
  redirect("/articles");
}
