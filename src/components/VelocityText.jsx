export function VelocityText({ text, className = "" }) {
  const copies = Array.from({ length: 10 }, (_, index) => (
    <span key={index}>{text}</span>
  ));

  return (
    <div className={`lp-velocity-wrap ${className}`.trim()}>
      <div className="lp-velocity">
        <div className="lp-velocity-track">{copies}</div>
      </div>
      <div className="lp-velocity">
        <div className="lp-velocity-track is-alt">{copies}</div>
      </div>
    </div>
  );
}
