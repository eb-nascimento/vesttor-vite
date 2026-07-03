import { Navigate } from "react-router";

function PublicRoute({ usuario, children }) {
  if (usuario) {
    return <Navigate to="/home" />;
  }
  return children;
}

export default PublicRoute;
