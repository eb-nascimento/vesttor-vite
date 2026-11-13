import { METODOS_PAGAMENTO } from "../../../data/metodosPagamento";
import { CATEGORIAS_DESPESA, CATEGORIAS_RECEITA, classificacaoPadraoDespesa } from "../../../data/categorias";
import { classificacaoTransacao } from "../../../utils/planejamento";
import { obterMensagemErroFirestore } from "../../../utils/errosFirestore";
import "./FormTransacao.css";
import { useState, useMemo, useRef } from "react";
import DatePicker from "../../../components/ui/DatePicker";
import {
  criarTransacao,
  validarTransacao,
  normalizarInputValor,
} from "../../../utils/transacao";
import { calcularParcelas, gerarSerieTransacoes } from "../../../utils/parcelamento";
import {
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Tag,
  Square,
  CheckSquare,
  Layers,
} from "lucide-react";
import CustomSelect from "../../../components/ui/CustomSelect";
import TipoSwitcher from "../../../components/ui/TipoSwitcher";

function obterDataAtual() {
  return new Date().toISOString().split("T")[0];
}



function obterPlaceholderDescricao(categoria, tipo) {
  if (tipo === "receita") {
    if (categoria === "Salário") return "Ex: Salário mensal, adiantamento...";
    if (categoria === "Freelance") return "Ex: Projeto website, consultoria...";
    if (categoria === "Investimentos")
      return "Ex: Dividendos, rendimento CDB...";
    return "Ex: Descrição da receita...";
  }

  if (categoria === "Alimentação")
    return "Ex: Mercado da semana, restaurante...";
  if (categoria === "Transporte") return "Ex: Uber, combustível, recarga...";
  if (categoria === "Moradia") return "Ex: Aluguel, condomínio, luz...";
  if (categoria === "Lazer") return "Ex: Cinema, jantar, viagem...";
  if (categoria === "Saúde") return "Ex: Farmácia, consulta, exame...";
  return "Ex: Descrição da despesa...";
}

function criarEstadoInicial(transacaoEditando) {
  if (transacaoEditando) {
    const isDespesa = transacaoEditando.tipo === "despesa";
    // Extrai o texto limpo da descrição (remove o sufixo " (X/Y)" se for série de parcelas)
    const descricaoLimpa = transacaoEditando.descricao
      ? transacaoEditando.descricao.replace(/\s*\(\d+\/\d+\)$/, "")
      : "";

    // Se for uma compra parcelada, o valor do formulário deve ser o total da compra
    const valorInicial = transacaoEditando.valorTotalCompra
      ? String(transacaoEditando.valorTotalCompra)
      : transacaoEditando.valor
        ? String(transacaoEditando.valor)
        : "";

    return {
      data: transacaoEditando.data?.toDate
        ? transacaoEditando.data.toDate().toISOString().split("T")[0]
        : transacaoEditando.data || obterDataAtual(),
      descricao: descricaoLimpa,
      valor: valorInicial,
      tipo: transacaoEditando.tipo || "despesa",
      classificacao: isDespesa ? classificacaoTransacao(transacaoEditando) : "Variável",
      metodoPagamento: transacaoEditando.metodoPagamento || "pix",
      categoria:
        transacaoEditando.categoria || (isDespesa ? "Alimentação" : "Salário"),
      parcelado: Boolean(
        transacaoEditando.parcelamentoId || transacaoEditando.parcelado,
      ),
      parcelas:
        transacaoEditando.totalParcelas || transacaoEditando.parcelas || 2,
      erro: "",
    };
  }

  return {
    data: obterDataAtual(),
    descricao: "",
    valor: "",
    tipo: "despesa",
    metodoPagamento: "pix",
    categoria: "Alimentação",
    classificacao: classificacaoPadraoDespesa("Alimentação"),
    parcelado: false,
    parcelas: 2,
    erro: "",
  };
}

function Form({
  onAdd,
  onAddParcelado,
  onEdit,
  onEditParcelado,
  onConverterParaParcelado,
  transacaoEditando,
  cancelarEdicao,
  onProcessandoChange,
}) {
  const [processando, setProcessando] = useState(false);
  const envioEmCurso = useRef(false);
  const [form, setForm] = useState(() => criarEstadoInicial(transacaoEditando));

  function atualizarCampo(campo, valor) {
    if (envioEmCurso.current && campo !== "erro") return;
    let valorProcessado = valor;

    if (campo === "valor") {
      valorProcessado = normalizarInputValor(valor);
    } else if (campo === "parcelas") {
      if (typeof valor === "string") {
        valorProcessado = valor.replace(/\D/g, "");
      }
    }

    setForm((prev) => {
      const atualizado = { ...prev, [campo]: valorProcessado };

      // Se o usuário alternar de despesa para receita, desliga o parcelamento
      if (campo === "tipo") {
        if (valor === "receita") {
          atualizado.parcelado = false;
          if (!CATEGORIAS_RECEITA.includes(prev.categoria)) {
            atualizado.categoria = "Salário";
          }
        } else {
          if (!CATEGORIAS_DESPESA.includes(prev.categoria)) {
            atualizado.categoria = "Alimentação";
          }
        }
      }

      if (campo === "categoria" || (campo === "tipo" && valor === "despesa")) {
        atualizado.classificacao = classificacaoPadraoDespesa(atualizado.categoria);
      }

      return atualizado;
    });
  }

  const categoriasDisponiveis = useMemo(() => {
    return form.tipo === "receita" ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
  }, [form.tipo]);

  // Cálculo da parcela em tempo real com precisão de centavos
  const calculoParcela = useMemo(() => {
    const numValor = Number(String(form.valor).replace(",", "."));
    if (!form.parcelado || !numValor || numValor <= 0) return null;
    const parcelasParsed = parseInt(form.parcelas, 10);
    const numParcelas = Math.min(
      72,
      Math.max(2, isNaN(parcelasParsed) ? 2 : parcelasParsed),
    );
    const calc = calcularParcelas(numValor, numParcelas, "total");

    return {
      ...calc,
      valorTotalFormatado: calc.valorTotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      valorParcelaFormatado: calc.valorParcelaBase.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      valorPrimeiraParcelaFormatado: calc.valorPrimeiraParcela.toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL",
        },
      ),
      temSobra: calc.valorPrimeiraParcela !== calc.valorParcelaBase,
    };
  }, [form.valor, form.parcelado, form.parcelas]);

  // Texto amigável no botão CTA principal
  const textoBotaoPrincipal = useMemo(() => {
    if (transacaoEditando) {
      return "Salvar alterações";
    }

    if (form.parcelado && form.tipo === "despesa" && calculoParcela) {
      return `+ Adicionar compra parcelada (${calculoParcela.numParcelas}x de ${calculoParcela.valorParcelaFormatado})`;
    }

    const numValor = Number(String(form.valor).replace(",", "."));
    if (numValor > 0) {
      const formatted = numValor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      return `+ Adicionar ${form.tipo === "receita" ? "Receita" : "Despesa"} (${formatted})`;
    }

    return "+ Adicionar transação";
  }, [
    transacaoEditando,
    form.parcelado,
    form.tipo,
    calculoParcela,
    form.valor,
  ]);

  async function salvar(e) {
    e.preventDefault();
    if (envioEmCurso.current) return;

    const mensagemErro = validarTransacao({
      data: form.data,
      descricao: form.descricao,
      valor: form.valor,
      tipo: form.tipo,
    });

    if (mensagemErro) {
      atualizarCampo("erro", mensagemErro);
      return;
    }

    atualizarCampo("erro", "");

    const valorNumerico = Number(String(form.valor).replace(",", "."));
    const parcelasParsed = parseInt(form.parcelas, 10);
    const numParcelasValidas = Math.min(
      72,
      Math.max(2, isNaN(parcelasParsed) ? 2 : parcelasParsed),
    );

    const isParceladoValido =
      form.tipo === "despesa" && Boolean(form.parcelado);

    const payload = {
      data: form.data,
      descricao: form.descricao.trim(),
      valor: valorNumerico,
      tipo: form.tipo,
      categoria: form.categoria,
      ...(form.tipo === "despesa" ? { classificacao: form.classificacao } : {}),
      ...(form.tipo === "despesa" && form.metodoPagamento
        ? { metodoPagamento: form.metodoPagamento }
        : {}),
      parcelado: isParceladoValido,
      ...(isParceladoValido ? { parcelas: numParcelasValidas } : {}),
    };

    envioEmCurso.current = true;
    setProcessando(true);
    onProcessandoChange?.(true);
    try {
      if (transacaoEditando) {
        const tinhaParcelamentoId = Boolean(transacaoEditando.parcelamentoId);

        if (tinhaParcelamentoId && onEditParcelado) {
          if (isParceladoValido) {
            // Atualiza toda a série recalculada com a nova quantidade de parcelas e valor
            const novaSerie = gerarSerieTransacoes({
              data: form.data,
              descricao: form.descricao,
              valor: valorNumerico,
              numParcelas: numParcelasValidas,
              modo: "total",
              categoria: form.categoria,
              classificacao: form.classificacao,
              metodoPagamento: form.metodoPagamento,
            });
            await onEditParcelado({
              parcelamentoId: transacaoEditando.parcelamentoId,
              novasParcelas: novaSerie,
            });
          } else {
            // Usuário desmarcou parcelamento: converte a série inteira em transação única
            const transacaoUnica = criarTransacao(
              payload.data,
              payload.descricao,
              valorNumerico,
              payload.tipo,
              payload.categoria,
              payload.metodoPagamento || "",
              false,
              1,
            );
            if (payload.tipo === "despesa") transacaoUnica.classificacao = form.classificacao;
            await onEditParcelado({
              parcelamentoId: transacaoEditando.parcelamentoId,
              novasParcelas: null,
              transacaoUnica,
            });
          }
        } else if (
          !tinhaParcelamentoId &&
          isParceladoValido &&
          onConverterParaParcelado
        ) {
          // Era transação única e foi convertida para compra parcelada
          const novaSerie = gerarSerieTransacoes({
            data: form.data,
            descricao: form.descricao,
            valor: valorNumerico,
            numParcelas: numParcelasValidas,
            modo: "total",
            categoria: form.categoria,
            classificacao: form.classificacao,
            metodoPagamento: form.metodoPagamento,
          });
          await onConverterParaParcelado(transacaoEditando.id, novaSerie);
        } else {
          // Edição simples de transação avulsa
          await onEdit(transacaoEditando.id, payload);
        }

        cancelarEdicao();
      } else if (isParceladoValido && onAddParcelado) {
        const serie = gerarSerieTransacoes({
          data: form.data,
          descricao: form.descricao,
          valor: valorNumerico,
          numParcelas: numParcelasValidas,
          modo: "total",
          categoria: form.categoria,
          classificacao: form.classificacao,
          metodoPagamento: form.metodoPagamento,
        });
        await onAddParcelado(serie);
      } else {
        const nova = criarTransacao(
          payload.data,
          payload.descricao,
          valorNumerico,
          payload.tipo,
          payload.categoria,
          payload.metodoPagamento || "",
          payload.parcelado,
          payload.parcelas || 1,
        );
        await onAdd({ ...nova, ...(form.tipo === "despesa" ? { classificacao: form.classificacao } : {}) });
      }

      // Reset para o estado inicial
      setForm({
        data: obterDataAtual(),
        descricao: "",
        valor: "",
        tipo: "despesa",
        metodoPagamento: "pix",
        categoria: "Alimentação",
        classificacao: classificacaoPadraoDespesa("Alimentação"),
        parcelado: false,
        parcelas: 2,
        erro: "",
      });
    } catch (erro) {
      atualizarCampo("erro", obterMensagemErroFirestore(erro, "Não foi possível salvar. Tente novamente."));
    } finally {
      envioEmCurso.current = false;
      setProcessando(false);
      onProcessandoChange?.(false);
    }
  }

  const isDespesa = form.tipo === "despesa";

  return (
    <section className="form-container">
      <div className="form-header">
        <h2>{transacaoEditando ? "Editar transação" : "Nova transação"}</h2>
        <p className="form-subtitulo">
          {transacaoEditando
            ? "Atualize as informações da movimentação selecionada."
            : "Registre uma receita ou despesa."}
        </p>
      </div>

      <form onSubmit={salvar} aria-busy={processando}>
        <fieldset disabled={processando} className="form-campos">
        {/* 1. SELETOR DE TIPO (DESPESA / RECEITA) */}
        <div className="form-item">
          <span id="tipo-label" className="form-item-label">Tipo</span>
          <TipoSwitcher
            aria-labelledby="tipo-label"
            opcoes={[
              {
                valor: "despesa",
                label: "Despesa",
                classeAdicional: "despesa",
              },
              {
                valor: "receita",
                label: "Receita",
                classeAdicional: "receita",
              },
            ]}
            valorAtual={form.tipo}
            onChange={(val) => atualizarCampo("tipo", val)}
          />
        </div>

        {/* 2. DATA */}
        <div className="form-data-valor">
        <div className="form-item">
          <label htmlFor="data">
            <Calendar size={13} aria-hidden="true" />
            Data
          </label>
          <DatePicker
            id="data"
            value={form.data}
            onChange={(novaData) => atualizarCampo("data", novaData)}
          />
        </div>

        {/* 3. VALOR */}
        <div className="form-item">
          <label htmlFor="valor">
            <DollarSign size={13} aria-hidden="true" />
            {form.parcelado ? "Valor total da compra" : "Valor"}
          </label>
          <div className="input-valor-wrapper">
            <span className="input-moeda-prefix">R$</span>
            <input
              id="valor"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={form.valor}
              onChange={(e) => atualizarCampo("valor", e.target.value)}
              className="input-valor-field"
              required
            />
          </div>
        </div>

        {/* 4. MÉTODO DE PAGAMENTO (apenas para despesas) */}
        </div>
        {isDespesa && (
          <div className="form-item">
            <label htmlFor="metodoPagamento">
              <CreditCard size={13} aria-hidden="true" />
              Método de pagamento
            </label>
            <CustomSelect
              id="metodoPagamento"
              value={form.metodoPagamento}
              onChange={(val) => atualizarCampo("metodoPagamento", val)}
              options={METODOS_PAGAMENTO}
            />
          </div>
        )}

        {/* 5. PARCELAMENTO (apenas para despesas) */}
        {isDespesa && (
          <div
            className="box-parcelamento"
            onClick={() => {
              atualizarCampo("parcelado", !form.parcelado);
            }}
          >
            <div className="parcelamento-topo">
              <button
                type="button"
                className="checkbox-custom"
                aria-checked={form.parcelado}
                role="checkbox"
                onClick={(e) => {
                  e.stopPropagation();
                  atualizarCampo("parcelado", !form.parcelado);
                }}
              >
                {form.parcelado ? (
                  <CheckSquare size={16} className="check-icon checked" />
                ) : (
                  <Square size={16} className="check-icon" />
                )}
              </button>
              <div className="parcelamento-textos">
                <span className="parcelamento-label">Parcelar esta compra</span>
                <span className="parcelamento-sub">
                  Dividir o valor em parcelas mensais
                </span>
              </div>
            </div>

            {/* Seletor expandido de parcelas quando ativado */}
            {form.parcelado && (
              <div
                className="parcelas-seletor"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="parcelas-input-row">
                  <label htmlFor="numParcelas" className="parcelas-lbl">
                    <Layers size={12} aria-hidden="true" />
                    Quantidade de parcelas:
                  </label>
                  <div className="parcelas-stepper">
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => {
                        const atual = parseInt(form.parcelas, 10) || 2;
                        atualizarCampo("parcelas", Math.max(2, atual - 1));
                      }}
                      disabled={Number(form.parcelas) <= 2}
                      aria-label="Diminuir uma parcela"
                    >
                      −
                    </button>
                    <input
                      id="numParcelas"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={form.parcelas}
                      onChange={(e) =>
                        atualizarCampo("parcelas", e.target.value)
                      }
                      onBlur={() => {
                        const num = parseInt(form.parcelas, 10);
                        if (isNaN(num) || num < 2) {
                          atualizarCampo("parcelas", 2);
                        } else if (num > 72) {
                          atualizarCampo("parcelas", 72);
                        } else {
                          atualizarCampo("parcelas", num);
                        }
                      }}
                      className="input-num-parcelas"
                      aria-label="Quantidade de parcelas"
                    />
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => {
                        const atual = parseInt(form.parcelas, 10) || 2;
                        atualizarCampo("parcelas", Math.min(72, atual + 1));
                      }}
                      disabled={Number(form.parcelas) >= 72}
                      aria-label="Aumentar uma parcela"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Atalhos rápidos de parcelas */}
                <div className="parcelas-atalhos">
                  {[2, 3, 6, 10, 12, 18, 24].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`atalho-btn ${Number(form.parcelas) === n ? "ativo" : ""}`}
                      onClick={() => atualizarCampo("parcelas", n)}
                    >
                      {n}x
                    </button>
                  ))}
                </div>

                {/* Resumo e prévia de cálculo */}
                {calculoParcela && (
                  <div className="resumo-calculo-parcela">
                    <div>
                      <strong>{calculoParcela.numParcelas}x</strong> de{" "}
                      <strong>{calculoParcela.valorParcelaFormatado}</strong> /
                      mês
                    </div>
                    <div
                      style={{
                        marginTop: "3px",
                        fontSize: "11px",
                        opacity: 0.85,
                      }}
                    >
                      Total da compra:{" "}
                      <strong>{calculoParcela.valorTotalFormatado}</strong>
                      {calculoParcela.temSobra && (
                        <span>
                          {" "}
                          (1ª parcela:{" "}
                          <strong>
                            {calculoParcela.valorPrimeiraParcelaFormatado}
                          </strong>{" "}
                          para ajuste de centavos)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 6. CATEGORIA */}
        <div className="form-item">
          <label htmlFor="categoria">
            <Tag size={13} aria-hidden="true" />
            Categoria
          </label>
          <CustomSelect
            id="categoria"
            value={form.categoria}
            onChange={(val) => atualizarCampo("categoria", val)}
            options={categoriasDisponiveis.map((cat) => ({
              valor: cat,
              label: cat,
            }))}
          />
        </div>

        {isDespesa && <div className="form-item">
          <label htmlFor="classificacao-transacao">Classificação</label>
          <CustomSelect
            id="classificacao-transacao"
            value={form.classificacao}
            onChange={(val) => atualizarCampo("classificacao", val)}
            options={[
              { valor: "Fixo", label: "Fixo" },
              { valor: "Variável", label: "Variável" },
            ]}
          />
          <small>Define qual orçamento desta categoria recebe o gasto.</small>
        </div>}

        {/* 7. DESCRIÇÃO */}
        <div className="form-item">
          <label htmlFor="descricao">
            <FileText size={13} aria-hidden="true" />
            Descrição
          </label>
          <input
            id="descricao"
            type="text"
            placeholder={obterPlaceholderDescricao(form.categoria, form.tipo)}
            value={form.descricao}
            onChange={(e) => atualizarCampo("descricao", e.target.value)}
            required
          />
        </div>

        {form.erro && (
          <p className="erro-msg" role="alert">
            {form.erro}
          </p>
        )}

        {/* 8. BOTÕES DE AÇÃO */}
        <div className="form-acoes">
          <button type="submit" className="btn-submit" disabled={processando}>
            {processando ? "Salvando…" : textoBotaoPrincipal}
          </button>

          {transacaoEditando && (
            <button
              type="button"
              className="btn-cancelar"
              disabled={processando}
              onClick={cancelarEdicao}
            >
              Cancelar edição
            </button>
          )}
        </div>

        </fieldset>
        {/* 9. HELPER RODAPÉ DO FIGMA */}
        <p className="form-helper-rodape">
          <span role="status">
            {processando ? "Salvando transação. Aguarde." : "Os saldos e a lista serão atualizados automaticamente."}
          </span>
        </p>
      </form>
    </section>
  );
}

export default Form;


