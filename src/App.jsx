import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./hooks/useAuth";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const { usuario, carregandoAuth } = useAuth();

  // Aguarda o Firebase confirmar se existe uma sessao salva no navegador.
  if (carregandoAuth) {
    return <p>Verificando sessão...</p>;
  }

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <PrivateRoute usuario={usuario}>
            <Dashboard usuario={usuario} />
          </PrivateRoute>
        }
      />
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
