import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { DocHubLogo } from "./dochub-logo.js";

type PublicLayoutProps = {
  header?: "dark" | "teal" | "light" | "home";
};

const navItems = [
  { to: "/", label: "início" },
  { to: "/cadastro", label: "sou paciente" },
  { to: "/cadastro", label: "sou médico" },
  { to: "/sobre", label: "sobre a marca" },
];

export function PublicLayout({ header = "light" }: PublicLayoutProps) {
  const { pathname } = useLocation();
  const logoVariant = header === "light" || header === "home" ? "dark" : "light";
  const scrollToTop = () => window.scrollTo(0, 0);
  const home = header === "home";
  const headerColors = {
    dark: "bg-[#2c3e4a] text-[#3dbe73]",
    teal: "bg-dochub-teal text-white",
    light: "border-b border-[#e6eeeb] bg-white text-dochub-teal",
    home: "fixed inset-x-0 top-0 z-20 border-b border-[#1f5c531f] bg-[#f2faf7d1] text-[#155a54] shadow-sm backdrop-blur-md",
  }[header];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className={`w-full px-0 py-3.5 ${headerColors}`}>
        <div className="mx-auto flex w-[min(1120px,calc(100%-40px))] items-center justify-between gap-6 max-[760px]:items-start">
          <DocHubLogo variant={logoVariant} />
          <nav className="flex items-center gap-[22px] max-[760px]:flex-wrap max-[760px]:justify-end max-[760px]:gap-x-3 max-[760px]:gap-y-2" aria-label="Principal">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className="text-[0.95rem] font-semibold no-underline max-[760px]:text-[0.8rem]"
              >
                {item.label}
              </NavLink>
            ))}
            {home ? (
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-[#36a34b] px-4 py-2 text-white no-underline max-[760px]:px-3 max-[760px]:py-1.5"
                to="/entrar"
              >
                <span className="size-2 rounded-full border border-white" />
                Entrar
              </Link>
            ) : null}
          </nav>
        </div>
      </header>
      <Outlet />
      <footer className={`mt-auto bg-dochub-teal py-9 pb-5 text-[#e8f4f1] ${home ? "bg-[#1c625e]" : ""}`}>
        <div className="mx-auto flex w-[min(1120px,calc(100%-40px))] items-center justify-between gap-6 max-[720px]:flex-wrap">
          <DocHubLogo variant="light" onClick={scrollToTop} />
          <div>
            <h2 className="mb-2 text-base font-bold">Links Úteis</h2>
            <Link className="mb-1.5 block text-sm text-inherit no-underline" to="/" onClick={scrollToTop}>Início</Link>
            <Link className="mb-1.5 block text-sm text-inherit no-underline" to="/cadastro" onClick={scrollToTop}>Sou paciente</Link>
            <Link className="mb-1.5 block text-sm text-inherit no-underline" to="/cadastro" onClick={scrollToTop}>Sou médico</Link>
            <Link className="mb-1.5 block text-sm text-inherit no-underline" to="/sobre" onClick={scrollToTop}>Sobre o DocHub</Link>
            <Link className="mb-1.5 block text-sm text-inherit no-underline" to="/entrar" onClick={scrollToTop}>Entrar</Link>
          </div>
          <div>
            <h2 className="mb-2 text-base font-bold">Contato</h2>
            <p className="mb-1.5 text-sm">+55 31 99947-0444</p>
            <p className="mb-1.5 text-sm">docHub@email.com</p>
          </div>
          <div className="flex gap-2.5" aria-label="Redes sociais">
            {["IG", "WA", "X", "in"].map((network) => (
              <span className="grid size-9 place-items-center rounded-full bg-[#2ea86a] text-[0.7rem] font-bold" key={network}>
                {network}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-7 text-center text-[0.78rem] text-[#d5ebe6]">
          © 2026 DocHub. Todos os direitos reservados.
          <br />
          DocHub número KvK: 123456658, endereço: Rua Fulano de Tal, 126 Belo
          Horizonte, Minas Gerais, Brasil
        </p>
      </footer>
    </div>
  );
}
