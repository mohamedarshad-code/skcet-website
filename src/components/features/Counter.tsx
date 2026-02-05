"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  label: string;
}

export function Counter({ end, duration = 2, suffix = "", label }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const totalMiliseconds = duration * 1000;
      const incrementTime = totalMiliseconds / end;

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
      <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
        {count}{suffix}
      </div>
      <div className="text-sm md:text-base font-medium text-blue-100/80 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
