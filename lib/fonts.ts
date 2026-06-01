import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";

export const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-family",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const fontBody = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-family",
  weight: ["400", "500", "600", "700"],
});

export const fontClassNames = `${fontDisplay.variable} ${fontBody.variable}`;
