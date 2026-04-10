import "./Topbar.css";

export default function Topbar({ onToggle }) {
  return (
    <header className="topbar">
      <button
        className="topbar__toggle"
        aria-label="Toggle sidebar"
        onClick={onToggle}
      >
        ☰
      </button>

      <div className="topbar__title-container">
        <h1 className="topbar__title">Inventra Commerce</h1>
      </div>
    </header>
  );
}
