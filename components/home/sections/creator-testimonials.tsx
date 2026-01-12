import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"
import { prisma } from "@/lib/prisma"

const dummyTestimonials = [
  {
    quote:
      "YT SHOP INDIA made selling my channel incredibly easy. The process was smooth, and I got a fair price for my 50K subscriber channel. Highly recommended!",
    name: "Rahul Sharma",
    designation: "Former Tech Channel Owner",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    quote:
      "I bought a monetized gaming channel through YT SHOP INDIA and it's been the best investment. The team verified everything and the transfer was seamless.",
    name: "Priya Patel",
    designation: "Gaming Content Creator",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    quote:
      "As someone new to YouTube, buying an established channel gave me a huge head start. YT SHOP INDIA's support throughout the process was exceptional.",
    name: "Amit Kumar",
    designation: "Business Content Creator",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    quote:
      "Sold my cooking channel for a great price. The platform is trustworthy and the WhatsApp support made everything so convenient. Thank you YT SHOP INDIA!",
    name: "Sneha Reddy",
    designation: "Food & Lifestyle Creator",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    quote:
      "The verification process was thorough and I felt confident buying through YT SHOP INDIA. My new channel is already generating revenue!",
    name: "Vikram Singh",
    designation: "Fitness Channel Owner",
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    quote:
      "Quick, professional, and reliable. YT SHOP INDIA helped me find the perfect channel for my niche. The entire experience exceeded my expectations.",
    name: "Ananya Desai",
    designation: "Travel Vlogger",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
]

export async function CreatorTestimonials() {
  const dbTestimonials = await prisma.testimonial.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  })

  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : dummyTestimonials

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Creator <span className="text-primary">Testimonials</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Hear from creators who have successfully bought and sold channels through YT SHOP INDIA.
          </p>
        </div>

        {/* Animated Testimonials */}
        <div className="flex justify-center">
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </div>
    </section>
  )
}

