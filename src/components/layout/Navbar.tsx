"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className={cn("font-bold text-xl leading-none", isScrolled ? "text-primary" : "text-white")}>
              SKCET
            </span>
            <span className={cn("text-[10px] uppercase tracking-widest font-semibold", isScrolled ? "text-muted-foreground" : "text-blue-100/60")}>
              Sri Krishna
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {["About", "Academics", "Admissions", "Research", "Placements"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent",
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              {item}
            </Link>
          ))}
          <div className="h-6 w-px bg-border/20 mx-2" />
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_") ? (
            <>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className={cn(
                    "px-5 py-2 rounded-full font-semibold transition-all hover:scale-105",
                    isScrolled ? "bg-primary text-white" : "bg-white text-primary"
                  )}>
                    Portal Access
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </>
          ) : (
            <button className={cn(
              "px-5 py-2 rounded-full font-semibold transition-all hover:opacity-80",
              isScrolled ? "bg-primary text-white" : "bg-white text-primary"
            )}>
              Portal Access
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-current"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} className={isScrolled ? "text-primary" : "text-white"} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white dark:bg-black z-40 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
           {["About", "Academics", "Admissions", "Research", "Placements"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-2xl font-bold border-b border-border pb-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <button className="mt-auto w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg">
            Apply Online
          </button>
        </div>
      )}
    </nav>
  );
};
