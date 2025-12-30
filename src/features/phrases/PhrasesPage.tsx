import { usePhrases } from "./usePhrases";
import { PhraseCard } from "./PhraseCard";
import "./phrases.css";

export function PhrasesPage() {
  const { categories, category, setCategory, filtered } = usePhrases();

  return (
    <div className="phrases">
      <main className="container">
        <header className="header">
          <div>
            <h1>Survival Japanese</h1>
            <p className="sub">One-tap sætninger – også offline</p>
          </div>
        </header>

        <section className="chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${c === category ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </section>

        <section className="list">
          {filtered.map((p) => (
            <PhraseCard key={p.id} phrase={p} />
          ))}
        </section>
      </main>
    </div>
  );
}