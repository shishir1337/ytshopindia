"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import * as React from "react"
import { Facebook, Youtube, Instagram, Phone, Mail, MapPin } from "lucide-react"

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Buy Channel", href: "/buy-channel" },
    { label: "Sell Channel", href: "/sell-channel" },
  ],
  legal: [
    { label: "Terms and Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refund Policy", href: "/refund" },
  ],
}

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://facebook.com",
  },
  {
    name: "YouTube",
    icon: Youtube,
    href: "https://youtube.com",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com",
  },
]

export function Footer() {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = mounted && theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"

  return (
    <footer className="w-full border-t border-t-primary/20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src={logoSrc}
                alt="YTShop India Logo"
                width={150}
                height={50}
                className="h-10 w-auto mb-4"
                priority
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your trusted marketplace for buying and selling YouTube channels. 
              Connect with creators and grow your digital presence.
            </p>
            
            {/* Follow Us */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-semibold text-foreground">Follow Us</h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5"
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <Icon className="size-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+919101782780"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="size-4" />
                  <span>+91 91017 82780</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@ytshopindia.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="size-4" />
                  <span>info@ytshopindia.com</span>
                </a>
              </li>
            </ul>
            
            <div className="pt-4 border-t border-t-primary/20">
              <h3 className="text-sm font-semibold text-foreground mb-2">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-t-primary/20 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} YTShop India. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Made with ❤️ for creators</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
