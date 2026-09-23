import "./PageHeader.css";

function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-header-container">
      <div className="page-header-texts">
        <h2>{title}</h2>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>

      {children && <div className="page-header-actions">{children}</div>}
    </div>
  );
}

export default PageHeader;
