import React from "react";
import "./PainelLateralPlanejamento.css";

function PainelLateralPlanejamento() {
  return (
    <div className="painel-lateral-planejamento">
      {/* Fechamento Projetado */}
      <div className="painel-card fechamento-projetado">
        <h3 className="painel-title">Fechamento projetado</h3>
        <p className="painel-subtitle">Se o mês terminar conforme planejado</p>

        <div className="saldo-card">
          <span className="saldo-label">Saldo disponível</span>
          <span className="saldo-valor">R$ 1.800</span>
        </div>

        <div className="track-container">
          <p className="track-label">Comprometimento total: 79%</p>
          <div className="track-bg">
            <div className="track-progress" style={{ width: "79%" }}></div>
          </div>
        </div>
      </div>

      {/* Próximos vencimentos */}
      <div className="painel-card proximos-vencimentos">
        <h3 className="painel-title">Próximos vencimentos</h3>

        <div className="vencimento-item">
          <div className="vencimento-badge">08</div>
          <span className="vencimento-nome">Aluguel</span>
          <span className="vencimento-valor">R$ 2.200</span>
        </div>
        <div className="vencimento-item">
          <div className="vencimento-badge">10</div>
          <span className="vencimento-nome">Condomínio</span>
          <span className="vencimento-valor">R$ 900</span>
        </div>
        <div className="vencimento-item">
          <div className="vencimento-badge">12</div>
          <span className="vencimento-nome">Internet + celular</span>
          <span className="vencimento-valor">R$ 300</span>
        </div>
      </div>

      {/* Alertas */}
      <div className="painel-card alertas-card">
        <h4 className="alertas-title">2 pontos de atenção</h4>
        <ul className="alertas-lista">
          <li>Lazer ultrapassou o limite em R$ 100.</li>
          <li>Freelance ainda tem R$ 300 pendentes.</li>
        </ul>
        <a href="#" className="alertas-link">
          Ver detalhes →
        </a>
      </div>
    </div>
  );
}

export default PainelLateralPlanejamento;
