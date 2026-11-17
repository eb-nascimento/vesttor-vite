import { METODOS_PAGAMENTO } from "../../../data/metodosPagamento";
import { classificacaoTransacao } from "../../../utils/planejamento";
import "./TabelaTransacoes.css";
import { Pencil, Trash2 } from "lucide-react";
import { useOperacaoAssincrona } from "../../../hooks/useOperacaoAssincrona";
import { useState } from "react";
import ConfirmModal from "../../../components/ui/ConfirmModal";

const formatarMetodo = (metodo) => {
  if (!metodo) return "-";
  const mapa = {
    pix: "Pix",
    cartao_credito: "Cartão de Crédito",
    cartao_debito: "Cartão de Débito",
    dinheiro: "Dinheiro",
    boleto: "Boleto",
    transferencia: "Transferência",
  };
  return mapa[metodo] || METODOS_PAGAMENTO.find(item => item.valor === metodo)?.label || metodo;
};

const obterDataFormatada = (data) => {
  if (!data) return "-";
  return data.toDate ? data.toDate().toLocaleDateString("pt-BR") : String(data);
};

function TabelaTransacoes({
  transacoes,
  onEditar,
  onExcluir,
  onSolicitarExclusaoParcelamento,
}) {
  const [itemParaExcluir, setItemParaExcluir] = useState(null);
  const { processando, erro, executar } = useOperacaoAssincrona(
    "Não foi possível excluir a transação. Tente novamente.",
  );
  if (!transacoes || transacoes.length === 0) {
    return (
      <div className="tabela-vazia desktop-only">
        Nenhuma transação encontrada no período.
      </div>
    );
  }

  const handleExcluir = (item) => {
    if (item.parcelamentoId && onSolicitarExclusaoParcelamento) {
      onSolicitarExclusaoParcelamento(item);
    } else {
      setItemParaExcluir(item);
    }
  };

  return (
    <div className="tabela-transacoes-container desktop-only">
      {processando && <p role="status">Excluindo transação...</p>}
      {erro && <p className="erro-msg" role="alert">{erro}</p>}
      <table className="tabela-transacoes">
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Método</th>
            <th>Tipo</th>
            <th className="th-valor">Valor</th>
            <th className="th-acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((item) => {
            const isReceita = item.tipo === "receita";
            const inicial = item.descricao
              ? item.descricao.charAt(0).toUpperCase()
              : isReceita
                ? "+"
                : "-";
            const dataStr = obterDataFormatada(item.data);
            const valorFormatado = (item.valor || 0).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            });

            const infoParcela = item.parcelamentoId
              ? `Parcela ${item.numeroParcela}/${item.totalParcelas}`
              : isReceita
                ? ""
                : "À vista";

            return (
              <tr key={item.id}>
                <td className="td-data">{dataStr}</td>
                <td className="td-descricao">
                  <div className="descricao-wrapper">
                    <div
                      className={`icone-inicial ${item.tipo}`}
                      aria-hidden="true"
                    >
                      {inicial}
                    </div>
                    <div className="descricao-textos">
                      <span className="nome">{item.descricao}</span>
                      {infoParcela && (
                        <span className="subtitulo">{infoParcela}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="td-categoria">{item.categoria || "-"}{!isReceita ? ` (${classificacaoTransacao(item).toLocaleLowerCase("pt-BR")})` : ""}</td>
                <td className="td-metodo">
                  {formatarMetodo(item.metodoPagamento)}
                </td>
                <td className="td-tipo">
                  <span className={`badge-tipo ${item.tipo}`}>
                    {isReceita ? "Receita" : "Despesa"}
                  </span>
                </td>
                <td className={`td-valor ${item.tipo}`}>
                  {isReceita ? `+ ${valorFormatado}` : `- ${valorFormatado}`}
                </td>
                <td className="td-acoes">
                  <div className="acoes-wrapper">
                    <button
                      className="btn-acao editar"
                      disabled={processando}
                      aria-label={`Editar ${item.descricao}`}
                      onClick={() => onEditar(item)}
                    >
                      <Pencil size={15} aria-hidden="true" />
                    </button>
                    <button
                      className="btn-acao excluir"
                      disabled={processando}
                      aria-label={`Excluir ${item.descricao}`}
                      onClick={() => handleExcluir(item)}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ConfirmModal
        isOpen={Boolean(itemParaExcluir)}
        onClose={() => setItemParaExcluir(null)}
        title="Excluir transação?"
        subtitle={`A transação ${itemParaExcluir?.descricao || ""} será excluída.`}
        confirmText="Excluir"
        processando={processando}
        onConfirm={async () => {
          if (await executar(() => onExcluir(itemParaExcluir.id))) setItemParaExcluir(null);
        }}
      >
        {erro && <p className="erro-msg" role="alert">{erro}</p>}
      </ConfirmModal>
    </div>
  );
}

export default TabelaTransacoes;

