export function CourseCover({ type, title, compact = false, progress }) {
  return (
    <div className={`course-cover cover-${type} ${compact ? "is-compact" : ""}`}>
      {type === "flag" && (
        <div className="flag-art">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className={i % 2 ? "stripe-white" : "stripe-red"} />
          ))}
          <div className="flag-union">
            {Array.from({ length: 20 }).map((_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
      )}
      {type === "chalkboard" && (
        <div className="board-art">
          <span>√x²</span>
          <span>(a+b)²</span>
          <span>πr²</span>
          <span>3x+7</span>
        </div>
      )}
      {type === "code" && (
        <div className="code-art">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <pre>{`function aprender() {\n  return "FIF";\n}`}</pre>
        </div>
      )}
      {type === "starry" && (
        <div className="starry-art">
          <div className="moon" />
          <div className="swirl" />
        </div>
      )}
      {type === "books" && <div className="books-art" />}
      {type === "music" && <div className="music-art" aria-hidden="true">♪ ♫</div>}
      {type === "shapes" && (
        <div className="shapes-art">
          <span className="tri" />
          <span className="circ" />
          <span className="sq" />
        </div>
      )}
      {!compact && <strong>{title}</strong>}
      {typeof progress === "number" && (
        <div className="cover-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
