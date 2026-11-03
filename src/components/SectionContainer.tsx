import React from "react";

export type SectionTone = "primary" | "secondary";

export interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  tone?: SectionTone;
  as?: "section" | "footer" | "div";
  borderPosition?: "bottom" | "top" | "both" | "none";
  containerClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export default function SectionContainer({
  id,
  tone = "primary",
  as: Component = "section",
  borderPosition = "bottom",
  containerClassName = "max-w-site mx-auto px-6 md:px-10",
  className = "",
  children,
  ...props
}: SectionContainerProps) {
  const toneClasses =
    tone === "primary"
      ? "bg-band-primary"
      : "bg-band-secondary";

  let borderClasses = "";
  if (borderPosition === "bottom") {
    borderClasses = "border-b border-black/5 dark:border-white/5";
  } else if (borderPosition === "top") {
    borderClasses = "border-t border-black/5 dark:border-white/5";
  } else if (borderPosition === "both") {
    borderClasses = "border-y border-black/5 dark:border-white/5";
  }

  return (
    <Component
      id={id}
      className={`relative transition-colors duration-300 ${toneClasses} ${borderClasses} ${className}`}
      {...props}
    >
      <div className={`relative z-10 ${containerClassName}`}>
        {children}
      </div>
    </Component>
  );
}
