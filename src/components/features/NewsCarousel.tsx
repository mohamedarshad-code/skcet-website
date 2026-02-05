"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
  tag: string;
}

interface CarouselProps {
  slides: Slide[];
}

export function NewsCarousel({ slides }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-3xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-wider mb-4">
              {slides[currentIndex].tag}
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 line-clamp-2">
              {slides[currentIndex].title}
            </h3>
            <p className="text-lg text-zinc-200 line-clamp-2">
              {slides[currentIndex].description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 right-8 flex gap-4">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="absolute top-8 right-8 flex gap-2">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-1.5 transition-all duration-300 rounded-full",
              idx === currentIndex ? "w-8 bg-accent" : "w-2 bg-white/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
