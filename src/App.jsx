import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./hooks/useAuth";
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
        path="/login"
        element={
          usuario ? <Navigate to="/dashboard" /> : <Login />
        }
      />
      <Route
        path="/dashboard"
        element={
          usuario ? <Dashboard usuario={usuario} /> : <Navigate to="/login" />
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

