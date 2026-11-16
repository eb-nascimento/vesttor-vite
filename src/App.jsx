import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./hooks/useAuth";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import AppLayout from "./layouts/AppLayout";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Transacoes from "./pages/Transacoes";
import Dashboard from "./pages/Dashboard";
import Budget from "./pages/Budget";
import Account from "./pages/Account";
import Payments from "./pages/Payments";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";

function App() {
  const { usuario, carregandoAuth } = useAuth();
  // Aguarda o Firebase confirmar se existe uma sessao salva no navegador.
  if (carregandoAuth) {
    return (
      <main className="app-loading" role="status" aria-label="Carregando Vesttor">
        <span className="app-loading__brand">Vesttor</span>
        <span className="app-loading__spinner" aria-hidden="true" />
        <span className="app-loading__text">Carregando...</span>
      </main>
    );
  }
  return (
    <Routes>
      <Route
        element={
          <PrivateRoute usuario={usuario}>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<Home usuario={usuario} />} />
        <Route path="/transacoes" element={<Transacoes usuario={usuario} />} />
        <Route path="/dashboard" element={<Dashboard usuario={usuario} />} />
        <Route path="/account" element={<Account usuario={usuario} />} />
        <Route path="/payments" element={<Payments usuario={usuario} />} />
        <Route path="/categories" element={<Categories usuario={usuario} />} />
        <Route path="/settings" element={<Settings usuario={usuario} />} />
        <Route path="/budget" element={<Budget usuario={usuario} />} />
      </Route>

      <Route
        path="/login"
        element={
          <PublicRoute usuario={usuario}>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/recuperar-senha"
        element={<Navigate to="/login?modo=recuperar" />}
      />
      <Route
        path="/auth/action"
        element={
          <PublicRoute usuario={usuario}>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={usuario ? "/home" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
