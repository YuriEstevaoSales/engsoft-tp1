import { Link } from "react-router";
import type { MouseEventHandler } from "react";

type DocHubLogoProps = {
  variant?: "light" | "dark";
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function DocHubLogo({ variant = "dark", onClick }: DocHubLogoProps) {
  const light = variant === "light";

  return (
    <Link className="inline-flex items-center gap-2 no-underline" to="/" aria-label="DocHub início" onClick={onClick}>
      <svg viewBox="0 0 40 44" className="h-10 w-9" aria-hidden="true">
        <path
          className={light ? "fill-white" : "fill-dochub-green"}
          d="M20 2c8 4 14 6 16 7v14c0 10-7 17-16 21C11 40 4 33 4 23V9c2-1 8-3 16-7z"
        />
        <path
          className={light ? "fill-dochub-teal" : "fill-white"}
          d="M20 13c-4.4 0-8 3.4-8 8.2 0 5.6 6.4 10.4 8 11.3 1.6-.9 8-5.7 8-11.3C28 16.4 24.4 13 20 13zm0 11.2c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"
        />
      </svg>
      <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-[#1f3d36]"}`}>
        DocHub
      </span>
    </Link>
  );
}
