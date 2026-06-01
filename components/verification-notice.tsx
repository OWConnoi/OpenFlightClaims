import type { Dictionary } from "@/lib/i18n";

interface VerificationNoticeProps {
  dictionary: Dictionary["notice"];
}

export function VerificationNotice({ dictionary }: VerificationNoticeProps) {
  return (
    <section className="notice" aria-label="Verification disclaimer">
      <p>{dictionary.text}</p>
    </section>
  );
}
