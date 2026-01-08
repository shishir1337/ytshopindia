"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import * as React from "react"
import { ChevronDown, Menu, X, LogOut, LayoutDashboard, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Buy Channel", href: "/buy-channel" },
  {
    label: "How To",
    href: "#",
    children: [
      { label: "Buy Youtube Channel", href: "/blog/how-to-buy-a-youtube-channel" },
      { label: "Sell Youtube Channel", href: "/blog/how-to-sell-a-youtube-channel" },
      { label: "Move channel to brand account", href: "/blog/how-to-move-youtube-channel-to-brand-account" },
    ]
  },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { data: session } = authClient.useSession()

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
  }, [pathname])

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

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully")
          router.replace("/login")
          router.refresh()
        },
      },
    })
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-b-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center z-50">
            <Image
              src={logoSrc}
              alt="YT Shop India Logo"
              width={120}
              height={40}
              className="h-8 w-auto sm:h-10"
              priority
            />
          </Link>

          {/* Center: Navigation Menu - Desktop */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => {
              if (item.children) {
                return (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary outline-none",
                      item.children.some(child => isActive(child.href)) ? "text-primary font-semibold" : "text-foreground"
                    )}>
                      {item.label}
                      <ChevronDown className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link
                            href={child.href}
                            className={cn(
                              "w-full cursor-pointer",
                              isActive(child.href) ? "text-primary font-semibold" : ""
                            )}
                          >
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }
              return (
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
              )
            })}
          </nav>

          {/* Right: Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="default" asChild className="whitespace-nowrap">
              <Link href="/sell-channel">Sell Channel</Link>
            </Button>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="size-9 border border-primary/20 transition-transform hover:scale-105">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5 leading-none">
                      <p className="font-medium text-sm">{session.user.name}</p>
                      <p className="w-[200px] truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 size-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {session.user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Shield className="mr-2 size-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}

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
              {/* Mobile Profile Section */}
              {session ? (
                <div className="mb-6 p-4 rounded-lg bg-muted/40 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="size-10">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="font-medium truncate">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <LayoutDashboard className="mr-2 size-4" />
                        Dashboard
                      </Link>
                    </Button>
                    {session.user.role === "admin" && (
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <Shield className="mr-2 size-4" />
                          Admin Dashboard
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
                      <LogOut className="mr-2 size-4" />
                      Log out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Sign In / Register
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  if (item.children) {
                    const isAnyChildActive = item.children.some(child => isActive(child.href))
                    return (
                      <div key={item.label} className="flex flex-col space-y-1">
                        <div className={cn(
                          "text-base font-semibold py-3 px-4 text-muted-foreground uppercase tracking-wider text-xs",
                          isAnyChildActive ? "text-primary" : ""
                        )}>
                          {item.label}
                        </div>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "text-base font-medium transition-colors hover:text-primary hover:bg-accent py-3 px-8 rounded-md",
                              isActive(child.href) ? "text-primary bg-primary/10" : "text-foreground"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )
                  }
                  return (
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
                  )
                })}
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
