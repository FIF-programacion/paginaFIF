import { useEffect, useRef } from "react";

export function TextEditor({ value, onChange, placeholder = "Escribe aquí…" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && value === "") ref.current.innerHTML = "";
  }, [value]);

  const run = (command, argument) => {
    ref.current?.focus();
    document.execCommand(command, false, argument);
    onChange(ref.current?.innerHTML || "");
  };

  return (
    <div className="rich-editor">
      <div className="rich-toolbar" role="toolbar" aria-label="Formato de texto">
        <button type="button" onClick={() => run("bold")}><b>B</b></button>
        <button type="button" onClick={() => run("italic")}><i>I</i></button>
        <button type="button" onClick={() => run("underline")}><u>U</u></button>
        <button type="button" onClick={() => run("formatBlock", "H2")}>Título</button>
        <button type="button" onClick={() => run("formatBlock", "H3")}>Subtítulo</button>
        <button type="button" onClick={() => run("formatBlock", "P")}>Párrafo</button>
        <button type="button" onClick={() => run("fontSize", "5")}>Grande</button>
        <button type="button" onClick={() => run("fontSize", "3")}>Normal</button>
      </div>
      <div
        ref={ref}
        className="rich-area"
        contentEditable
        role="textbox"
        aria-label={placeholder}
        data-placeholder={placeholder}
        onInput={() => onChange(ref.current?.innerHTML || "")}
      />
    </div>
  );
}
