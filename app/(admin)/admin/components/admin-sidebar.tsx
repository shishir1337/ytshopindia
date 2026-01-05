"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Youtube,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { SignOutButton } from "./sign-out-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Blog",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    name: "Listings",
    href: "/admin/listings",
    icon: Youtube,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-card"
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link
            href="/admin"
            className="flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
              <Youtube className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-sidebar-foreground">
                YT Shop Admin
              </span>
              <span className="text-xs text-muted-foreground">Dashboard</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                )}
                <Icon className="size-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <SignOutButton />
        </div>
      </aside>
    </>
  );
}
