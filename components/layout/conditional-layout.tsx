"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show header/footer for admin routes
  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/admin-login");
  
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

