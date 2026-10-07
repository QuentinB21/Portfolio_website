/** Neutral code sample illustrating RefScope without exposing workplace code. */
export function RefScopeExample() {
  return (
    <figure className="refscope-example">
      <div className="refscope-editor">
        <div className="refscope-editor-heading"><span>Exemple.cs</span><span>C#</span></div>
        <div className="refscope-editor-code">
          <div className="refscope-codelens">
            <span><strong>4</strong> references</span>
            <span><strong>2</strong> main refs</span>
            <span><strong>2</strong> test refs</span>
            <span><strong>2/2</strong> passing</span>
          </div>
          <pre><code><span className="refscope-keyword">public</span> <span className="refscope-type">Configuration</span> <span className="refscope-method">LoadConfiguration</span>(){'\n'}{'{\n'}{'    '}<span className="refscope-control">return</span> <span className="refscope-method">ReadSettings</span>();{'\n}'}</code></pre>
        </div>
      </div>
      <figcaption>
        Quatre références au total, mais deux appels dans l’application.
        Exemple illustratif avec du code fictif.
      </figcaption>
    </figure>
  )
}
