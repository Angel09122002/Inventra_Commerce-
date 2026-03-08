import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <h2>Inventra Commerce</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/" end className="sidebar__link">
          Dashboard
        </NavLink>

        <NavLink to="/products" className="sidebar__link">
          Products
        </NavLink>

        <NavLink to="/orders" className="sidebar__link">
          Orders
        </NavLink>

        <NavLink to="/customers" className="sidebar__link">
          Customers
        </NavLink>

        <NavLink to="/inventory" className="sidebar__link">
          Inventory
        </NavLink>

        <NavLink to="/payments" className="sidebar__link">
          Payments
        </NavLink>
      </nav>
    </aside>
  );
}
