import {
  CircleUserRound,
  LogOut,
} from "lucide-react";
import { logout } from "../services/authService";
import "./MenuAccount.css";

function MenuAccount() {
  return (
    <div className="menu-account">
      <button
        type="button"
        className="menu-account-button"
        aria-label="Menu da conta"
      >
        <CircleUserRound size={24} aria-hidden="true" />
      </button>
      <div className="menu-account-dropdown">
        <ul>
          <li>
            <a href="/account">Minha Conta</a>
          </li>
          <li>
            <a href="/payments">Métodos de Pagamento</a>
          </li>
          <li>
            <a href="/categories">Minhas Categorias</a>
          </li>
          <li>
            <a href="/settings">Configurações</a>
          </li>
          <li>
            <button type="button" onClick={logout} aria-label="Sair">
              <LogOut size={24} aria-hidden="true" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MenuAccount;
