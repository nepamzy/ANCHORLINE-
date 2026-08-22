import type { ReactNode } from "react";
import { Container } from "./Container";

type Variant = "paper" | "offwhite" | "navy" | "gold" | "transparent";

const variantClasses: Record<Variant, string> = {
  paper: "bg-paper",
  offwhite: "bg-offwhite",
  navy: "bg-navy-900 text-white",
  gold: "bg-gold-100",
  transparent: "",
};

export function Section({
  children,
  tint = false,
  variant,
  className = "",
}: {
  children: ReactNode;
  /** @deprecated use `variant="offwhite"` instead */
  tint?: boolean;
  variant?: Variant;
  className?: string;
}) {
  const resolved = variant ?? (tint ? "offwhite" : "paper");
  return (
    <section className={`${variantClasses[resolved]} py-16 sm:py-20`}>
      <Container className={className}>{children}</Container>
    </section>
  );
}
