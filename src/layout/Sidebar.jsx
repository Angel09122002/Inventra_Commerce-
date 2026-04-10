/* src/layout/Sidebar.jsx */
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar app-layout__sidebar">
      <div className="sidebar__brand">
        <h2>Inventra Commerce</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar__nav">
        <a href="/" className="sidebar__link" data-end="true">
          Dashboard
        </a>

        <a href="/products" className="sidebar__link">
          Products
        </a>

        <a href="/orders" className="sidebar__link">
          Orders
        </a>

        <a href="/customers" className="sidebar__link">
          Customers
        </a>

        <a href="/inventory" className="sidebar__link">
          Inventory
        </a>

        <a href="/payments" className="sidebar__link">
          Payments
        </a>
      </nav>
    </aside>
  );
}
