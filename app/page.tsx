import { redirect } from "next/navigation";
import { getLocalePath, defaultLocale } from "@/lib/site";

export default function RootPage() {
  redirect(getLocalePath(defaultLocale));
}
