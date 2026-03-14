import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Rufio Yrael",
  description: "Underground electronic music — mixes, shows, and releases.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        {/* subtle ember texture */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_30%_10%,rgba(255,80,60,0.12),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(255,80,60,0.08),transparent_40%)]" />

        {/* ghost portrait background */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-y-0 left-[-19%] w-[52vw] min-w-[320px] max-w-[760px] bg-cover bg-left-center opacity-[0.20] grayscale"
            style={{
              backgroundImage: "url('/images/rufio-portrait.png')",
              maskImage:
                "linear-gradient(to right, black 0%, black 42%, rgba(0,0,0,0.75) 62%, rgba(0,0,0,0.35) 78%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, black 0%, black 42%, rgba(0,0,0,0.75) 62%, rgba(0,0,0,0.35) 78%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10">
          <SiteNav />
          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}