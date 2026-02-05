"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

export function Toast({ id, message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-success" />,
    error: <AlertCircle className="h-5 w-5 text-error" />,
    info: <Info className="h-5 w-5 text-primary" />,
  };

  const bgColors = {
    success: "bg-success/10 border-success/20",
    error: "bg-error/10 border-error/20",
    info: "bg-primary/10 border-primary/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "flex items-center gap-4 min-w-[320px] rounded-2xl border p-4 shadow-xl backdrop-blur-md dark:bg-zinc-900/90",
        bgColors[type]
      )}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-foreground">{message}</p>
      <button 
        onClick={() => onClose(id)}
        className="rounded-full p-1 hover:bg-black/5 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// Simple store-like hook for global toasts could be added, but starting with individual components
