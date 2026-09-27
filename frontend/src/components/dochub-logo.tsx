import { Link } from "react-router";

type DocHubLogoProps = {
  variant?: "light" | "dark";
};

export function DocHubLogo({ variant = "dark" }: DocHubLogoProps) {
  const fill = variant === "light" ? "#ffffff" : "#2ea86a";
  const word = variant === "light" ? "#ffffff" : "#1f3d36";

  return (
    <Link className="dochub-logo" to="/" aria-label="DocHub início">
      <svg viewBox="0 0 40 44" width="36" height="40" aria-hidden="true">
        <path
          fill={fill}
          d="M20 2c8 4 14 6 16 7v14c0 10-7 17-16 21C11 40 4 33 4 23V9c2-1 8-3 16-7z"
        />
        <path
          fill={variant === "light" ? "#1a6b66" : "#ffffff"}
          d="M20 13c-4.4 0-8 3.4-8 8.2 0 5.6 6.4 10.4 8 11.3 1.6-.9 8-5.7 8-11.3C28 16.4 24.4 13 20 13zm0 11.2c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"
        />
      </svg>
      <span className="dochub-logo-text" style={{ color: word }}>
        DocHub
      </span>
    </Link>
  );
}
