import { InputHTMLAttributes, useState } from "react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordInput({ className = "", ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative block">
      <input
        {...props}
        className={`${className} pr-12`}
        type={visible ? "text" : "password"}
      />
      <button
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visible}
        className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-[#52706a] hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-dochub-teal"
        type="button"
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeClosedIcon /> : <EyeOpenIcon />}
      </button>
    </span>
  );
}

function EyeOpenIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path d="m3 3 18 18M10.6 6.9A10.5 10.5 0 0 1 12 7c6 0 9.5 5 9.5 5a16 16 0 0 1-3.1 3.2M6.2 6.2C3.8 7.6 2.5 12 2.5 12s3.5 5 9.5 5c1.1 0 2.1-.2 3-.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
