import "./EquacaoMes.css";

function EquacaoMes({
  entradasPlanejadas = 0,
  entradasRealizadas = 0,
  fixosPlanejados = 0,
  fixosRealizados = 0,
  variaveisPlanejados = 0,
  variaveisRealizados = 0,
  saldoProjetado = 0,
  porcentagemSaldo = 0,
}) {
  // Função auxiliar para formatar em Reais (R$)
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <section className="equacao-mes-container">
      <div className="fluxo-coluna">
        <span className="fluxo-titulo">ENTRADAS</span>
        <span className="fluxo-valor receita">
          {formatarMoeda(entradasPlanejadas)}
        </span>
        <span className="fluxo-subtitulo">
          {formatarMoeda(entradasRealizadas)} confirmados
        </span>
      </div>

      <span className="operador-matematico">–</span>

      <div className="fluxo-coluna">
        <span className="fluxo-titulo">FIXOS</span>
        <span className="fluxo-valor">{formatarMoeda(fixosPlanejados)}</span>
        <span className="fluxo-subtitulo">
          {formatarMoeda(fixosRealizados)} realizados
        </span>
      </div>

      <span className="operador-matematico">–</span>

      <div className="fluxo-coluna">
        <span className="fluxo-titulo">VARIÁVEIS</span>
        <span className="fluxo-valor variavel">
          {formatarMoeda(variaveisPlanejados)}
        </span>
        <span className="fluxo-subtitulo">
          {formatarMoeda(variaveisRealizados)} realizados
        </span>
      </div>

      <span className="operador-matematico">=</span>

      <div className="fluxo-coluna">
        <span className="fluxo-titulo">SALDO PROJETADO</span>
        <span className="fluxo-valor saldo">
          {formatarMoeda(saldoProjetado)}
        </span>
        <span className="fluxo-subtitulo">
          {entradasPlanejadas > 0
            ? `${porcentagemSaldo}% das entradas`
            : "Sem receita base"}
        </span>
      </div>
    </section>
  );
}

export default EquacaoMes;
