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
import Account from "./pages/Account";
import Payments from "./pages/Payments";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";

function App() {
  const { usuario, carregandoAuth } = useAuth();
  // Aguarda o Firebase confirmar se existe uma sessao salva no navegador.
  if (carregandoAuth) {
    return <p>Verificando sessão...</p>;
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
        <Route path="/transacoes" element={<Transacoes />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/settings" element={<Settings />} />
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
        path="*"
        element={<Navigate to={usuario ? "/home" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
