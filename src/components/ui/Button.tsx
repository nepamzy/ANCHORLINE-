import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "gold" | "whatsapp";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-navy-900 text-white hover:bg-navy-800 focus-visible:bg-navy-800",
  secondary:
    "bg-transparent text-navy-900 border border-navy-900 hover:bg-navy-50",
  gold: "bg-gold-500 text-navy-950 hover:brightness-95",
  whatsapp:
    "bg-[#25D366] text-white hover:brightness-95",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-control px-5 py-3 text-sm font-semibold transition-colors min-h-11";

export function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...rest
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link href={href} className={`${base} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
