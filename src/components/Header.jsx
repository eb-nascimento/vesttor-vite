import "./Header.css";
import { NavLink } from "react-router";
import LogoGrafia from "./LogoGrafia.jsx";

import { logout } from "../services/authService";

function Header() {
  return (
    <header>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <LogoGrafia />
        </NavLink>
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/transacoes"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Transações
        </NavLink>
      </nav>
      <button type="button" onClick={logout}>
        Sair
      </button>
    </header>
  );
}
export default Header;
