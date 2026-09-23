import "./Header.css";

import MenuAccount from "./MenuAccount.jsx";

import { NavLink } from "react-router";
import LogoGrafia from "./LogoGrafia.jsx";
import LogoGrafia from "./ui/logos/LogoGrafia.jsx";

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
        <NavLink
          to="/budget"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Orçamentos
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Dashboard
        </NavLink>
      </nav>

      <MenuAccount />
    </header>
  );
}
export default Header;
