import { useState } from "react";
import "../styles/App.css";
import { PhrasesPage } from "../features/phrases/PhrasesPage";
import { RestaurantsPage } from "../features/restaurants/RestaurantsPage";

type Tab = "phrases" | "restaurants";

export default function App() {
  const [tab, setTab] = useState<Tab>("phrases");
  const [menuOpen, setMenuOpen] = useState(false);

  function selectTab(t: Tab) {
    setTab(t);
    setMenuOpen(false);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <button
            className="menu-button mobile-only"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((s) => !s)}
          >
            ☰
          </button>

          <div className="brand">
            <div className="brand-title">Survival Japanese</div>
            <div className="brand-sub">Offline phrases + nearby restaurants</div>
          </div>

          <nav className="tabs desktop-only" role="tablist">
            <button
              className={`tab ${tab === "phrases" ? "active" : ""}`}
              onClick={() => selectTab("phrases")}
            >
              Phrases
            </button>
            <button
              className={`tab ${tab === "restaurants" ? "active" : ""}`}
              onClick={() => selectTab("restaurants")}
            >
              Restaurants
            </button>
          </nav>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <button
              className={`tab ${tab === "phrases" ? "active" : ""}`}
              onClick={() => selectTab("phrases")}
            >
              Phrases
            </button>
            <button
              className={`tab ${tab === "restaurants" ? "active" : ""}`}
              onClick={() => selectTab("restaurants")}
            >
              Restaurants
            </button>
          </div>
        )}
      </header>

      <main>{tab === "phrases" ? <PhrasesPage /> : <RestaurantsPage />}</main>
    </div>
  );
}