"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import * as React from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Buy Channel", href: "/buy-channel" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
]

export function Header() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Use light logo as default until mounted to avoid hydration mismatch
  const logoSrc = mounted && theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [])

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-b-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center z-50">
            <Image
              src={logoSrc}
              alt="YTShop India Logo"
              width={120}
              height={40}
              className="h-8 w-auto sm:h-10"
              priority
            />
          </Link>

          {/* Center: Navigation Menu - Desktop */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href) ? "text-primary font-semibold" : "text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="default" asChild className="whitespace-nowrap">
              <Link href="/sell-channel">Sell Channel</Link>
            </Button>
            <ModeToggle />
          </div>

          {/* Mobile: Menu Button and Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Off Canvas */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Mobile Menu Panel - Slides from right */}
        <div
          className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-background border-l border-l-primary/20 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-b-primary/20">
              <span className="text-lg font-semibold text-primary">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-5" />
              </Button>
            </div>

            {/* Menu Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-base font-medium transition-colors hover:text-primary hover:bg-accent py-3 px-4 rounded-md",
                      isActive(item.href) ? "text-primary bg-primary/10" : "text-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Sell Channel Button */}
              <div className="pt-6 mt-6 border-t border-t-primary/20">
                <Button variant="default" asChild className="w-full" size="lg">
                  <Link href="/sell-channel" onClick={() => setMobileMenuOpen(false)}>
                    Sell Channel
                  </Link>
                </Button>
              </div>
            </div>

            {/* Menu Footer */}
            <div className="p-4 border-t border-t-primary/20">
              <div className="flex items-center justify-center">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  )
}
