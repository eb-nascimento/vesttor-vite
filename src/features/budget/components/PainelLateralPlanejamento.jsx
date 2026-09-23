
import "./PainelLateralPlanejamento.css";

function PainelLateralPlanejamento({
  saldoProjetado = 0,
  porcentagemComprometida = 0,
}) {
  return (
    <div className="painel-lateral-planejamento">
      {/* Fechamento Projetado */}
      <div className="painel-card fechamento-projetado">
        <h3 className="painel-title">Fechamento projetado</h3>
        <p className="painel-subtitle">Se o mês terminar conforme planejado</p>

        <div className="saldo-card">
          <span className="saldo-label">Saldo disponível</span>
          <span className="saldo-valor">R$ {saldoProjetado.toFixed(2)}</span>
        </div>

        <div className="track-container">
          <p className="track-label">
            {porcentagemComprometida === 101 && saldoProjetado < 0
              ? "Comprometimento: Orçamento excedido"
              : `Comprometimento total: ${porcentagemComprometida}%`}
          </p>
          <div className="track-bg">
            <div
              className="track-progress"
              style={{
                width: `${Math.min(porcentagemComprometida, 100)}%`,
                backgroundColor:
                  porcentagemComprometida > 100 ? "#ff5967" : "#20aeff",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Próximos vencimentos */}
      {/* <div className="painel-card proximos-vencimentos">
        <h3 className="painel-title">Próximos vencimentos</h3>
        {proximosVencimentos.length === 0 ? (
          <p className="painel-subtitle">Nenhuma despesa futura este mês.</p>
        ) : (
          proximosVencimentos.map((t) => {
            const dataObj = t.data.toDate
              ? t.data.toDate()
              : new Date(`${t.data}T12:00:00`);
            const dia = String(dataObj.getDate()).padStart(2, "0");
            return (
              <div key={t.id} className="vencimento-item">
                <div className="vencimento-badge">{dia}</div>
                <span className="vencimento-nome" title={t.descricao}>
                  {t.categoria}
                </span>
                <span className="vencimento-valor">
                  R$ {Number(t.valor).toFixed(2)}
                </span>
              </div>
            );
          })
        )}
      </div> */}

      {/* Alertas */}
      <div className="painel-card alertas-card">
        <h4 className="alertas-title">Em breve</h4>
        <ul className="alertas-lista">
          <li>Notificações automáticas de alertas aparecerão aqui.</li>
        </ul>
      </div>
    </div>
  );
}

export default PainelLateralPlanejamento;
