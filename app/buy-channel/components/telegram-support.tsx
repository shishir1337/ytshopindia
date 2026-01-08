import Link from "next/link"
import { IconBrandTelegram } from "@tabler/icons-react"

export function TelegramSupport() {
    return (
        <Link
            href="https://t.me/ytshopindia_support"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#2AABEE] px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#2AABEE] focus:ring-offset-2"
        >
            <IconBrandTelegram className="size-5" />
            <span className="font-medium">Need help?</span>
        </Link>
    )
}
