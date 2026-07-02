import "./Header.css";
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
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <LogoGrafia />
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/transacoes"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Transacoes
        </NavLink>
        <button type="button" onClick={logout}>
          Sair
        </button>
      </nav>
    </header>
  );
}
export default Header;
