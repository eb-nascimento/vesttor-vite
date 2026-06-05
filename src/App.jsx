import { useState } from "react";
import "./App.css";

import { useTransacoes } from "./hooks/useTransacoes";

import Header from "./components/Header";
import ContainerResumo from "./components/ContainerResumo";
import Form from "./components/Form";
import ListaTransacoes from "./components/ListaTransacoes";

function App() {
  const {
    transacoes,
    adicionarTransacao,
    excluirTransacao,
    editarTransacao,
    iniciarEdicao,
    transacaoEditando,
    saldo,
    receitas,
    despesas,
  } = useTransacoes();

  return (
    <>
      <Header />
      <main>
        <ContainerResumo
          saldo={saldo}
          receitas={receitas}
          despesas={despesas}
        />
        <Form
          onAdd={adicionarTransacao}
          onEdit={editarTransacao}
          transacaoEditando={transacaoEditando}
        />
        <ListaTransacoes
          transacoes={transacoes}
          onExcluir={excluirTransacao}
          onEditar={iniciarEdicao}
        />
      </main>
    </>
  );
}

export default App;
