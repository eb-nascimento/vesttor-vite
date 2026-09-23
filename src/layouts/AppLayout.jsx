import { Outlet } from "react-router";
import Header from "../layouts/Header";

export function AppLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AppLayout;
