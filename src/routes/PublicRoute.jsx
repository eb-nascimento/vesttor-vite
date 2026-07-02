import { Navigate } from "react-router";

function PublicRoute({ usuario, children }) {
  if (usuario) {
    return <Navigate to="/dashboard" />;
  }
  return children;
}

export default PublicRoute;
