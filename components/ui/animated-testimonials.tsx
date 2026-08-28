"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  /** `null` when the uploaded file is missing - an initial is shown instead. */
  src: string | null;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => index === active;

  useEffect(() => {
    if (!autoplay || testimonials.length <= 1) return;

    const interval = setInterval(
      () => setActive((prev) => (prev + 1) % testimonials.length),
      5000
    );
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  const getRotation = (index: number) => ((index * 7) % 21) - 10;

  return (
    <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        <div>
          <div className="relative h-80 w-full">
            {testimonials.map((testimonial, index) => {
              const active = isActive(index);
              return (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="absolute inset-0 origin-bottom transition-[transform,opacity] duration-400 ease-in-out"
                  style={{
                    opacity: active ? 1 : 0.7,
                    transform: `scale(${active ? 1 : 0.95}) rotate(${
                      active ? 0 : getRotation(index)
                    }deg)`,
                    zIndex: active ? 40 : testimonials.length + 2 - index,
                  }}
                  aria-hidden={!active}
                >
                  {/* The pop animation restarts on its own whenever the class
                      (and therefore animation-name) is toggled back on. */}
                  <div
                    className={`h-full w-full ${
                      active ? "animate-testimonial-card-pop" : ""
                    }`}
                  >
                    {testimonial.src ? (
                      <Image
                        src={testimonial.src}
                        alt={testimonial.name}
                        fill
                        sizes="(max-width: 768px) 90vw, 420px"
                        draggable={false}
                        className="rounded-3xl object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-3xl bg-primary/10 text-6xl font-bold text-primary">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <div key={active} className="animate-in fade-in duration-200">
            <h3 className="text-2xl font-bold text-foreground">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {testimonials[active].designation}
            </p>
            <p className="mt-8 text-lg text-muted-foreground">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <span
                  key={index}
                  className="inline-block animate-testimonial-word-in"
                  style={{ animationDelay: `${0.02 * index}s` }}
                >
                  {word}&nbsp;
                </span>
              ))}
            </p>
          </div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="group/button flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft
                className="h-5 w-5 transition-transform duration-300 group-hover/button:rotate-12"
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="group/button flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ArrowRight
                className="h-5 w-5 transition-transform duration-300 group-hover/button:-rotate-12"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
