import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import CardResumo from "./components/CardResumo";

function App() {
  return (
    <>
      <Header />

      <main>
        <CardResumo title="Saldo Total" balance="R$ 5.000,00" type="saldo" />

        <CardResumo title="Receitas" balance="R$ 8.000,00" type="receita" />

        <CardResumo title="Despesas" balance="R$ 3.000,00" type="despesa" />
      </main>
    </>
  );
}

export default App;
