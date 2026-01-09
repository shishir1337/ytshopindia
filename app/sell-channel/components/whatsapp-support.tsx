import Link from "next/link"
import { IconBrandWhatsapp } from "@tabler/icons-react"

export function WhatsAppSupport() {
    return (
        <Link
            href="https://wa.me/919101782780"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        >
            <IconBrandWhatsapp className="size-5" />
            <span className="font-medium">Need help?</span>
        </Link>
    )
}
