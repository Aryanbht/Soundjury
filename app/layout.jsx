import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata = {
  title: "SoundJury — Your Music. Brutally Reviewed.",
  description:
    "Upload your track and lyrics. Get a professional critique from 5 simulated listener personas powered by AI. Honest feedback for independent artists.",
  keywords: ["music critique", "AI music review", "independent artist", "song feedback", "audio analysis"],
  openGraph: {
    title: "SoundJury — Your Music. Brutally Reviewed.",
    description: "AI-powered music critique for independent artists.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
