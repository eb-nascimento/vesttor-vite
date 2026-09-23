import "./Button.css";
import { Loader2 } from "lucide-react";

export default function Button({
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`btn-ui btn-ui-${variant} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && <Loader2 className="btn-ui-loader" />}
      <span className="btn-ui-content">{children}</span>
    </button>
  );
}
