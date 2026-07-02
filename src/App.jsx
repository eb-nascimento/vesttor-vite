import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./hooks/useAuth";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import AppLayout from "./layouts/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transacoes from "./pages/Transacoes";

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
        <Route path="/dashboard" element={<Dashboard usuario={usuario} />} />
        <Route path="/transacoes" element={<Transacoes />} />
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
        element={<Navigate to={usuario ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
