"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Store" },
  { href: "/stk", label: "STK Push" },
  { href: "/payment-links", label: "Payment Links" },
  { href: "/send-money", label: "Send Money" },
  { href: "/webhooks", label: "Webhooks" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-bangers text-2xl tracking-wide">Komiks KE</span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
              {pathname === href && (
                <span className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
          <div className="ml-2 border-l border-border pl-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
