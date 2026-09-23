

function TipoSwitcher({ opcoes, valorAtual, onChange }) {
  return (
    <div className="tipo-switcher" role="group">
      {opcoes.map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          className={`tipo-btn ${valorAtual === opcao.valor ? `ativo ${opcao.classeAdicional || ""}` : ""}`}
          onClick={() => onChange(opcao.valor)}
        >
          {opcao.label}
        </button>
      ))}
    </div>
  );
}

export default TipoSwitcher;
