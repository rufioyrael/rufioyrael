import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Rufio Yrael",
  description: "Underground electronic music — mixes, shows, and releases.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        {/* subtle texture */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(255,80,60,0.12),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(255,80,60,0.08),transparent_40%)]" />
        <div className="relative">
          <SiteHeader />
          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
