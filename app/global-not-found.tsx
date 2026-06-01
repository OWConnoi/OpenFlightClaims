import { NotFoundContent } from "@/components/not-found-content";
import { getThemeScript } from "@/lib/theme";
import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
      </head>
      <body>
        <NotFoundContent />
      </body>
    </html>
  );
}
