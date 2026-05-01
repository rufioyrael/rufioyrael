import "./globals.css";
import FluidCanvas from "@/components/FluidCanvas";
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
        <FluidCanvas />

        {/* subtle ember texture */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_30%_10%,rgba(255,80,60,0.12),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(255,80,60,0.08),transparent_40%)]" />

        {/* centered portrait watermark */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-[18%] -translate-x-1/2 w-[103vw] max-w-295 bg-center bg-contain bg-no-repeat opacity-[0.17] grayscale"
            style={{
              backgroundImage: "url('/images/rufio-portrait.png')",
              maskImage:
                "radial-gradient(ellipse 75% 80% at 50% 45%, black 15%, rgba(0,0,0,0.55) 50%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 80% at 50% 45%, black 15%, rgba(0,0,0,0.55) 50%, transparent 78%)",
            }}
          />
        </div>

        <div className="relative z-10">
          <SiteNav />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}