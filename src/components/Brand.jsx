import { Link } from "react-router-dom";

const WORDMARK = [
  ["F", "#3b82f6"],
  ["I", "#16a34a"],
  ["F", "#14b8a6"],
  [" ", "#3b82f6"],
  ["L", "#22d3ee"],
  ["E", "#3b82f6"],
  ["A", "#8b5cf6"],
  ["R", "#d946ef"],
  ["N", "#f43f5e"],
  ["I", "#ef4444"],
  ["N", "#dc2626"],
  ["G", "#b91c1c"],
];

export function Wordmark({ className = "", size = "md" }) {
  return (
    <span className={`wordmark wordmark-${size} ${className}`}>
      {WORDMARK.map(([letter, color], i) => (
        <span key={`${letter}-${i}`} style={{ color }}>
          {letter}
        </span>
      ))}
    </span>
  );
}

export function BrandLockup({ to = "/", showLogo = true, extra = null }) {
  return (
    <Link to={to} className="brand-lockup">
      {showLogo && (
        <img src="/images/logo-fundacion.jpg" alt="Fundación Integral de Familias" className="brand-logo" />
      )}
      <span className="brand-text">
        <Wordmark />
        {extra}
      </span>
    </Link>
  );
}

export function RainbowTitle({ parts, as: Tag = "h1", className = "" }) {
  return (
    <Tag className={`rainbow-title ${className}`}>
      {parts.map((part, i) => (
        <span key={i} style={{ color: part.color }}>
          {part.text}
          {i < parts.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
