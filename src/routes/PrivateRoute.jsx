import { Navigate } from "react-router";

function PrivateRoute({ usuario, children }) {
  if (!usuario) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default PrivateRoute;
