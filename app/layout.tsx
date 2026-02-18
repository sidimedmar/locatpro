import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "LocatPro Pro - نظام إدارة العقارات المتقدم",
  description:
    "نظام متكامل لإدارة العقارات والمستأجرين والمدفوعات والصيانة في موريتانيا مع قاعدة بيانات سحابية",
};

export const viewport: Viewport = {
  themeColor: "#065f46",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>{children}</body>
    </html>
  );
}
