

function TipoSwitcher({ opcoes, valorAtual, onChange, "aria-labelledby": ariaLabelledby }) {
  return (
    <div className="tipo-switcher" role="group" aria-labelledby={ariaLabelledby}>
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
