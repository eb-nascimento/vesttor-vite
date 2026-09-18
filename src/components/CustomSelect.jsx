import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "./CustomSelect.css";

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find((opt) => opt.valor === value);
  const displayValue = selectedOption
    ? selectedOption.label
    : placeholder || "Selecione...";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`custom-select ${disabled ? "disabled" : ""}`}
      ref={selectRef}
    >
      <button
        type="button"
        id={id}
        className={`custom-select-trigger ${isOpen ? "open" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="custom-select-value">{displayValue}</span>
        <ChevronDown
          size={16}
          className={`custom-select-icon ${isOpen ? "open" : ""}`}
        />
      </button>

      {isOpen && (
        <ul className="custom-select-list" role="listbox">
          {options.map((option) => (
            <li
              key={option.valor}
              className={`custom-select-item ${option.valor === value ? "selected" : ""}`}
              role="option"
              aria-selected={option.valor === value}
              onClick={() => {
                onChange(option.valor);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
