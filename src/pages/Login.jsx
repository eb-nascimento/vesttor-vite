import FormAuth from "../components/FormAuth";
import { useLocation, useSearchParams } from "react-router";

function Login() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const modoDaUrl = searchParams.get("modo");
  const modo =
    location.pathname === "/auth/action" && modoDaUrl === null
      ? "redefinir"
      : modoDaUrl || "login";

  // A pagina de login apenas compoe o formulario; a regra de redirecionamento fica no App.
  return (
    <div>
      <FormAuth modo={modo} />
    </div>
  );
}

export default Login;

