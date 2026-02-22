import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandMark">IC</div>
      </div>

      <div className="brandName">Inventra Commerce</div>
      <div className="brandSub">Admin Dashboard</div>

      <nav className="nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
