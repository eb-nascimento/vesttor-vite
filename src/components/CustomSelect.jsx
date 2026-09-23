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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const listRef = useRef(null);

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

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) {
      const index = options.findIndex((opt) => opt.valor === value);
      setHighlightedIndex(index >= 0 ? index : 0);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        const index = options.findIndex((opt) => opt.valor === value);
        setHighlightedIndex(index >= 0 ? index : 0);
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        onChange(options[highlightedIndex].valor);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleBlur = (e) => {
    if (selectRef.current && !selectRef.current.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`custom-select ${disabled ? "disabled" : ""}`}
      ref={selectRef}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <button
        type="button"
        id={id}
        className={`custom-select-trigger ${isOpen ? "open" : ""}`}
        onClick={handleToggle}
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
        <ul className="custom-select-list" role="listbox" ref={listRef}>
          {options.map((option, index) => (
            <li
              key={option.valor}
              className={`custom-select-item ${option.valor === value ? "selected" : ""} ${highlightedIndex === index ? "highlighted" : ""}`}
              role="option"
              aria-selected={option.valor === value}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(option.valor);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
