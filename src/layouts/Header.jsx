import "./Header.css";
import { useState } from "react";
import { NavLink } from "react-router";
import { House, ArrowLeftRight, Wallet, Menu } from "lucide-react";
import MenuAccount from "./MenuAccount.jsx";
import LogoGrafia from "../components/ui/logos/LogoGrafia.jsx";

function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  return (
    <>
      <header className="app-header">
        <NavLink to="/home" className="header-logo" aria-label="Vesttor — Início"><LogoGrafia /></NavLink>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/transacoes">Transações</NavLink>
          <NavLink to="/budget">Orçamentos</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
        <MenuAccount />
      </header>
      <nav className="mobile-nav" aria-label="Navegação mobile">
        <NavLink to="/home" onClick={() => setMenuAberto(false)}><House size={18} aria-hidden="true" />Início</NavLink>
        <NavLink to="/transacoes" onClick={() => setMenuAberto(false)}><ArrowLeftRight size={18} aria-hidden="true" />Transações</NavLink>
        <NavLink to="/budget" onClick={() => setMenuAberto(false)}><Wallet size={18} aria-hidden="true" />Orçamentos</NavLink>
        <button type="button" aria-expanded={menuAberto} aria-controls="mobile-menu" onClick={() => setMenuAberto(!menuAberto)}><Menu size={18} aria-hidden="true" />Menu</button>
      </nav>
      {menuAberto && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mais páginas" onKeyDown={(event) => { if (event.key === "Escape") setMenuAberto(false); }}>
          {[['/dashboard', 'Dashboard'], ['/categories', 'Categorias'], ['/payments', 'Métodos de pagamento'], ['/account', 'Minha conta'], ['/settings', 'Configurações']].map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setMenuAberto(false)}>{label}</NavLink>
          ))}
        </nav>
      )}
    </>
  );
}
export default Header;
