import { useState, useRef, useEffect, useId } from "react";
import { ChevronDown } from "lucide-react";
import "./CustomSelect.css";

const normalizar = texto => String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export default function CustomSelect({ options, value, onChange, placeholder, disabled, id, ariaLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();
  const selectedOption = options.find(opt => opt.valor === value);
  const filtradas = options.filter(opt => normalizar(opt.label).includes(normalizar(busca)));
  const indiceAtivo = highlightedIndex >= 0 && highlightedIndex < filtradas.length ? highlightedIndex : -1;
  const fechar = () => { setIsOpen(false); setBusca(""); setHighlightedIndex(-1); };
  const abrir = () => { if (!disabled) { setBusca(""); setHighlightedIndex(-1); setIsOpen(true); } };
  const escolher = option => { onChange(option.valor); fechar(); inputRef.current?.focus(); };

  useEffect(() => {
    const fora = event => { if (!selectRef.current?.contains(event.target)) { setIsOpen(false); setBusca(""); setHighlightedIndex(-1); } };
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, []);
  useEffect(() => {
    if (isOpen && indiceAtivo >= 0) listRef.current?.children[indiceAtivo]?.scrollIntoView?.({ block: "nearest" });
  }, [indiceAtivo, isOpen]);

  function teclado(e) {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) { abrir(); return; }
      setHighlightedIndex(atual => e.key === "ArrowDown" ? Math.min(atual + 1, filtradas.length - 1) : Math.max(atual - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!isOpen) abrir();
      else if (indiceAtivo >= 0) escolher(filtradas[indiceAtivo]);
      else if (filtradas.length === 1) escolher(filtradas[0]);
    } else if (e.key === "Escape" && isOpen) {
      e.preventDefault(); e.stopPropagation(); fechar();
    } else if (e.key === "Tab") fechar();
  }
  return <div className={`custom-select ${disabled ? "disabled" : ""}`} ref={selectRef} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) fechar(); }}>
    <div className={`custom-select-trigger ${isOpen ? "open" : ""}`}>
      <input ref={inputRef} id={id} aria-label={ariaLabel} disabled={disabled} className="custom-select-input" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={isOpen} aria-controls={listId} aria-activedescendant={isOpen && indiceAtivo >= 0 ? `${listId}-${indiceAtivo}` : undefined} autoComplete="off" placeholder={isOpen ? "Digite para buscar..." : placeholder || "Selecione..."} value={isOpen ? busca : selectedOption?.label || ""} onFocus={abrir} onClick={() => { if (!isOpen) abrir(); }} onChange={e => { setBusca(e.target.value); setHighlightedIndex(-1); setIsOpen(true); }} onKeyDown={teclado} />
      <ChevronDown size={16} aria-hidden="true" className={`custom-select-icon ${isOpen ? "open" : ""}`} />
    </div>
    {isOpen && <ul id={listId} className="custom-select-list" role="listbox" aria-label={ariaLabel || "Opções"} ref={listRef}>
      {filtradas.map((option, index) => <li id={`${listId}-${index}`} key={option.valor} className={`custom-select-item ${option.valor === value ? "selected" : ""} ${indiceAtivo === index ? "highlighted" : ""}`} role="option" aria-selected={option.valor === value} onMouseDown={e => e.preventDefault()} onClick={() => escolher(option)} onMouseEnter={() => setHighlightedIndex(index)}>{option.label}</li>)}
      {!filtradas.length && <li className="custom-select-empty" role="presentation">Nenhuma opção encontrada.</li>}
    </ul>}
  </div>;
}
