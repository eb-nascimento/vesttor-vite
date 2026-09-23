import { useId, forwardRef } from "react";
import "./Input.css";

const Input = forwardRef(
  (
    {
      label,
      helper,
      error,
      styleType = "surface",
      className = "",
      prefix,
      suffix,
      ...props
    },
    ref
  ) => {
    const defaultId = useId();
    const inputId = props.id || defaultId;

    const baseClass = `input-ui input-ui-${styleType} ${
      error ? "input-ui-error" : ""
    } ${className}`;

    return (
      <div className="input-ui-wrapper">
        {label && (
          <label htmlFor={inputId} className="input-ui-label">
            {label}
          </label>
        )}

        <div className="input-ui-container">
          {prefix && <span className="input-ui-prefix">{prefix}</span>}
          <input ref={ref} id={inputId} className={baseClass} {...props} />
          {suffix && <span className="input-ui-suffix">{suffix}</span>}
        </div>

        {(error || helper) && (
          <span className={`input-ui-helper ${error ? "helper-error" : ""}`}>
            {error || helper}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
