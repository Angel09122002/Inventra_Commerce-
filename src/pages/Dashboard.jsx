import { useEffect, useState } from "react";
import InfoCard from "../components/InfoCard";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    payments: 0,
    inventory: [],
    lowStock: [],
    recentOrders: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes, oRes, invRes, payRes] = await Promise.all([
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/customers"),
          fetch("http://localhost:5000/api/orders"),
          fetch("http://localhost:5000/api/inventory"),
          fetch("http://localhost:5000/api/payments"),
        ]);

        if (!pRes.ok || !cRes.ok || !oRes.ok || !invRes.ok || !payRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [products, customers, orders, inventory, payments] =
          await Promise.all([
            pRes.json(),
            cRes.json(),
            oRes.json(),
            invRes.json(),
            payRes.json(),
          ]);

        const inventoryData = inventory.data || [];
        const ordersData = orders.data || [];
        const paymentsData = payments.data || [];

        const lowStock = inventoryData.filter((item) => item.current_stock < 5);
        const recentOrders = ordersData.slice(0, 5);

        setStats({
          products: products.data?.length || 0,
          customers: customers.data?.length || 0,
          orders: ordersData.length,
          payments: paymentsData.length,
          inventory: inventoryData,
          lowStock,
          recentOrders,
          loading: false,
          error: "",
        });
      } catch (error) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Something went wrong",
        }));
      }
    };

    fetchData();
  }, []);

  const {
    loading,
    error,
    products,
    customers,
    orders,
    payments,
    lowStock,
    recentOrders,
  } = stats;

  if (loading) {
    return (
      <section className="dashboard">
        <div className="dashboard__status">Loading dashboard...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard">
        <div className="dashboard__status dashboard__status--error">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <p className="dashboard__eyebrow">Overview</p>
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">
            Quick view of products, customers, orders, and payments.
          </p>
        </div>
      </div>

      <div className="dashboard__summary">
        <InfoCard
          title="Products"
          fields={[{ label: "Total", value: products }]}
        />
        <InfoCard
          title="Customers"
          fields={[{ label: "Total", value: customers }]}
        />
        <InfoCard title="Orders" fields={[{ label: "Total", value: orders }]} />
        <InfoCard
          title="Payments"
          fields={[{ label: "Total", value: payments }]}
        />
      </div>

      <div className="dashboard__main-grid">
        <div className="dashboard__panel dashboard__panel--large">
          <div className="dashboard__panel-header">
            <div>
              <p className="dashboard__panel-label">Main Overview</p>
              <h2 className="dashboard__panel-title">Inventory Snapshot</h2>
            </div>
          </div>

          <div className="dashboard__overview-grid">
            <div className="dashboard__mini-stat">
              <span className="dashboard__mini-stat-label">Products</span>
              <strong className="dashboard__mini-stat-value">{products}</strong>
            </div>

            <div className="dashboard__mini-stat">
              <span className="dashboard__mini-stat-label">Customers</span>
              <strong className="dashboard__mini-stat-value">
                {customers}
              </strong>
            </div>

            <div className="dashboard__mini-stat">
              <span className="dashboard__mini-stat-label">Orders</span>
              <strong className="dashboard__mini-stat-value">{orders}</strong>
            </div>

            <div className="dashboard__mini-stat">
              <span className="dashboard__mini-stat-label">Payments</span>
              <strong className="dashboard__mini-stat-value">{payments}</strong>
            </div>
          </div>

          <div className="dashboard__panel-section">
            <h3 className="dashboard__section-title">Low Stock Items</h3>

            {lowStock.length === 0 ? (
              <p className="dashboard__empty">
                All items are sufficiently stocked.
              </p>
            ) : (
              <div className="dashboard__list">
                {lowStock.map((item) => (
                  <div key={item.product_id} className="dashboard__list-item">
                    <div>
                      <p className="dashboard__list-title">{item.name}</p>
                      <p className="dashboard__list-subtitle">
                        SKU: {item.sku}
                      </p>
                    </div>
                    <span className="dashboard__badge">
                      {item.current_stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard__side-column">
          <div className="dashboard__panel">
            <div className="dashboard__panel-header">
              <div>
                <p className="dashboard__panel-label">Recent Activity</p>
                <h2 className="dashboard__panel-title">Latest Orders</h2>
              </div>
            </div>

            {recentOrders.length === 0 ? (
              <p className="dashboard__empty">No recent orders.</p>
            ) : (
              <div className="dashboard__activity-list">
                {recentOrders.map((order) => (
                  <div
                    key={order.order_id}
                    className="dashboard__activity-item"
                  >
                    <div className="dashboard__activity-dot" />
                    <div>
                      <p className="dashboard__activity-title">
                        Order #{order.order_id}
                      </p>
                      <p className="dashboard__activity-text">
                        {order.first_name} {order.last_name}
                      </p>
                      <p className="dashboard__activity-date">
                        {order.order_date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard__panel">
            <div className="dashboard__panel-header">
              <div>
                <p className="dashboard__panel-label">Quick Stats</p>
                <h2 className="dashboard__panel-title">Business Summary</h2>
              </div>
            </div>

            <div className="dashboard__quick-stats">
              <div className="dashboard__quick-row">
                <span>Total products</span>
                <strong>{products}</strong>
              </div>
              <div className="dashboard__quick-row">
                <span>Total customers</span>
                <strong>{customers}</strong>
              </div>
              <div className="dashboard__quick-row">
                <span>Total orders</span>
                <strong>{orders}</strong>
              </div>
              <div className="dashboard__quick-row">
                <span>Total payments</span>
                <strong>{payments}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
