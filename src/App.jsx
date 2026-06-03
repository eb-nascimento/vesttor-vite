import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import ContainerResumo from "./components/ContainerResumo";
import Form from "./components/Form";

import {
  calcularSaldo,
  calcularReceitas,
  calcularDespesas,
} from "./utils/calculos";

function App() {
  const [transacoes, setTransacoes] = useState([]);

  function adicionarTransacao(nova) {
    setTransacoes([...transacoes, nova]);
  }

  return (
    <>
      <Header />
      <main>
        <ContainerResumo
          saldo={calcularSaldo(transacoes)}
          receitas={calcularReceitas(transacoes)}
          despesas={calcularDespesas(transacoes)}
        />
        <Form onAdd={adicionarTransacao} />
      </main>
    </>
  );
}

export default App;
