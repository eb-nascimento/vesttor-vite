import { Navigate, NavLink } from "react-router";
import Logo from "./Logo.jsx";
import LogoVertical from "./LogoVertical.jsx";
import LogoHorizontal from "./LogoHorizontal.jsx";
import LogoGrafia from "./LogoGrafia.jsx";

import { logout } from "../services/authService";

function Header() {
  return (
    <header>
      <nav>
        <NavLink to="/">
          <LogoGrafia />
        </NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/transacoes">Transacoes</NavLink>
        <button type="button" onClick={logout}>
          Sair
        </button>
      </nav>
    </header>
  );
}
export default Header;
