import { Roboto, Poppins } from "next/font/google";
import "./globals.css";
import { NavBar } from "../components/NavBar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata = {
  title: "GEEKS FF Likes Store",
  description:
    "Send Free Fire profile likes with confidence. Check availability, remaining days, and contact the GEEKS FF team.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body className="antialiased bg-slate-950 text-slate-100 font-[family:var(--font-poppins)]">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
