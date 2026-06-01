import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import fr from "@/messages/fr.json";
import ur from "@/messages/ur.json";
import { getLocale, type LocaleCode } from "@/i18n/locales";

export const dictionaries = {
  en,
  es,
  fr,
  ar,
  ur,
} satisfies Record<LocaleCode, typeof en>;

export type Dictionary = typeof en;

export function getDictionary(code: string | null | undefined = "en") {
  return dictionaries[getLocale(code).code];
}
