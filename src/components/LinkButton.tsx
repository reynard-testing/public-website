import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo } from "react";

type LinkButtonProps = Readonly<{
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark" | "light";
  icon?: ReactNode;
}>;

export default function LinkButton({
  href,
  children,
  variant = "light",
  icon = null,
}: LinkButtonProps) {
  const styling = useMemo(() => {
    switch (variant) {
      case "primary":
        return "bg-primary text-white group-hover:bg-primary";
      case "secondary":
        return "bg-secondary text-gray-900 group-hover:text-black group-hover:bg-white";
    }
  }, [variant]);

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block p-4 -m-4 group cursor-pointer"
    >
      <button
        type="button"
        className={`p-2 pr-6 rounded-full shadow-sm font-semibold text-md flex items-center gap-2 transition-colors cursor-pointer duration-200 ${styling}`}
      >
        {icon && <span className="w-8 h-8 cursor-pointer">{icon}</span>}
        {children}
      </button>
    </Link>
  );
}
