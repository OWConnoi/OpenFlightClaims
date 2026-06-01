import { notFound } from "next/navigation";
import { HomePage } from "@/components/home-page";
import { isLocaleCode } from "@/i18n/locales";

interface LocalePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocaleCode(locale)) {
    notFound();
  }

  return <HomePage localeCode={locale} />;
}
