import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import AntdProvider from "@components/providers/AntdRegistry";
import SessionProviderWrapper from "@components/providers/SessionProviderWrapper";
import SocialMediaIcons from "@components/Atoms/SocialMediaIcons";
import { Suspense } from "react";
import VietnameseHistoryLoading from "@components/Molecules/HistoryLoading";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@components/Atoms/GoogleAnalytics";
import Providers from "@components/providers/TanstackProvider/inderx";

const StreetSignSans = localFont({
  src: "./fonts/StreetSignSans.otf",
  variable: "--font-bd-street-sign",
});

const DFVNGraphit = localFont({
  src: "./fonts/DFVNGraphitRegular.otf",
  variable: "--font-dfvn-graphit",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Đại Việt Kỳ Nhân",
    default: "Đại Việt Kỳ Nhân",
  },
  description: "Dự án vẽ minh hoạ các tiền nhân lịch sử/văn hoá dân tộc❤️",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${StreetSignSans.variable} ${DFVNGraphit.variable} antialiased`}
      >
        <ToastContainer />
        <GoogleAnalytics />
        <Providers>
          <SessionProviderWrapper>
            <AntdProvider>
              <SpeedInsights />
              <Suspense fallback={<VietnameseHistoryLoading />}>
                {children}
              </Suspense>
            </AntdProvider>
          </SessionProviderWrapper>
        </Providers>
      </body>
    </html>
  );
}
