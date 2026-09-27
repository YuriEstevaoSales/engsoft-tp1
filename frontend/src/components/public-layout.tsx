import { Link, NavLink, Outlet } from "react-router";
import { DocHubLogo } from "./dochub-logo.js";

type PublicLayoutProps = {
  header?: "dark" | "teal" | "light";
};

const navItems = [
  { to: "/", label: "início" },
  { to: "/cadastro", label: "sou paciente" },
  { to: "/cadastro", label: "sou médico" },
  { to: "/sobre", label: "sobre a marca" },
];

export function PublicLayout({ header = "light" }: PublicLayoutProps) {
  const logoVariant = header === "light" ? "dark" : "light";

  return (
    <div className={`site site-header-${header}`}>
      <header className="site-header">
        <div className="site-header-inner">
          <DocHubLogo variant={logoVariant} />
          <nav className="site-nav" aria-label="Principal">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <Outlet />
      <footer className="site-footer">
        <div className="site-footer-inner">
          <DocHubLogo variant="light" />
          <div>
            <h2>Links Uteis</h2>
            <Link to="/">Início</Link>
            <Link to="/cadastro">Sou paciente</Link>
            <Link to="/cadastro">Sou médico</Link>
            <Link to="/sobre">Sobre a Marca</Link>
            <Link to="/entrar">Entrar</Link>
          </div>
          <div>
            <h2>Contato</h2>
            <p>+55 31 99947-0444</p>
            <p>marca@email.com</p>
          </div>
          <div className="site-social" aria-label="Redes sociais">
            <span>IG</span>
            <span>WA</span>
            <span>X</span>
            <span>in</span>
          </div>
        </div>
        <p className="site-legal">
          © 2025 Marca. Todos os direitos reservados.
          <br />
          Marca B.V., número KvK: 123456658, endereço: Rua Fulano de Tal, 126 Belo
          Horizonte, Minas Gerais, Brasil
        </p>
      </footer>
    </div>
  );
}
