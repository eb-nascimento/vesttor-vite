import { Children } from "react";
import CustomSelect from "./CustomSelect";

// Mantém a interface dos selects existentes usando o menu compartilhado.
export default function Select({ children, value, onChange, className = "", id, disabled, "aria-label": ariaLabel }) {
  const options = Children.toArray(children).map(option => ({
    valor: option.props.value ?? option.props.children,
    label: option.props.children,
  }));
  return <div className={`select-field ${className}`}><CustomSelect id={id} disabled={disabled} ariaLabel={ariaLabel} value={value} options={options} onChange={valor => onChange({ target: { value: valor } })} /></div>;
}
