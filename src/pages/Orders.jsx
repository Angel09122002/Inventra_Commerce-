import { useEffect, useMemo, useState } from "react";
import API_URL from "../config/api";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders`);

        if (!response.ok) {
          throw new Error("Could not load orders");
        }

        const result = await response.json();
        setOrders(result.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const metrics = useMemo(() => {
    const totalOrders = orders.length;

    const completedOrders = orders.filter(
      (order) =>
        String(order.status || order.fulfillment_status || "")
          .toLowerCase()
          .includes("complete") ||
        String(order.status || order.fulfillment_status || "")
          .toLowerCase()
          .includes("fulfilled"),
    ).length;

    const pendingOrders = orders.filter(
      (order) =>
        String(order.status || order.payment_status || "")
          .toLowerCase()
          .includes("pending") ||
        String(order.fulfillment_status || "")
          .toLowerCase()
          .includes("unfulfilled"),
    ).length;

    const totalRevenue = orders.reduce((sum, order) => {
      const amount =
        Number(order.total_amount) ||
        Number(order.amount) ||
        Number(order.total) ||
        0;
      return sum + amount;
    }, 0);

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;

    if (filter === "pending") {
      return orders.filter((order) => {
        const value = `${order.status || ""} ${order.payment_status || ""} ${
          order.fulfillment_status || ""
        }`.toLowerCase();
        return value.includes("pending") || value.includes("unfulfilled");
      });
    }

    if (filter === "completed") {
      return orders.filter((order) => {
        const value = `${order.status || ""} ${order.payment_status || ""} ${
          order.fulfillment_status || ""
        }`.toLowerCase();
        return value.includes("complete") || value.includes("fulfilled");
      });
    }

    return orders;
  }, [orders, filter]);

  const getCustomerName = (order) => {
    if (order.customer_name) return order.customer_name;

    const fullName =
      `${order.first_name || ""} ${order.last_name || ""}`.trim();
    if (fullName) return fullName;

    return "N/A";
  };

  const getTotal = (order) => {
    const value =
      Number(order.total_amount) ||
      Number(order.amount) ||
      Number(order.total) ||
      0;
    return `$${value.toFixed(2)}`;
  };

  const getPaymentBadgeClass = (order) => {
    const status = String(
      order.payment_status || order.status || "",
    ).toLowerCase();

    if (
      status.includes("success") ||
      status.includes("paid") ||
      status.includes("completed")
    ) {
      return "orders-badge orders-badge--success";
    }

    if (status.includes("pending")) {
      return "orders-badge orders-badge--warning";
    }

    return "orders-badge orders-badge--neutral";
  };

  const getFulfillmentBadgeClass = (order) => {
    const status = String(
      order.fulfillment_status || order.status || "",
    ).toLowerCase();

    if (status.includes("fulfilled") || status.includes("completed")) {
      return "orders-badge orders-badge--success";
    }

    if (status.includes("unfulfilled") || status.includes("pending")) {
      return "orders-badge orders-badge--danger";
    }

    return "orders-badge orders-badge--neutral";
  };

  if (loading) {
    return (
      <section className="orders-page">
        <div className="orders-page__status">Loading orders...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="orders-page">
        <div className="orders-page__status orders-page__status--error">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <div className="orders-page__header">
        <div>
          <p className="orders-page__eyebrow">Sales</p>
          <h1 className="orders-page__title">Orders</h1>
          <p className="orders-page__subtitle">
            Track order activity using the data currently available in your
            system.
          </p>
        </div>

        {/* <div className="orders-page__actions">
          <button
            className="orders-page__button orders-page__button--ghost"
            type="button"
          >
            Export
          </button>
          <button className="orders-page__button" type="button">
            Create Order
          </button>
        </div> */}
      </div>

      <div className="orders-metrics">
        <div className="orders-metric-card">
          <p className="orders-metric-card__label">Total Orders</p>
          <h2 className="orders-metric-card__value">{metrics.totalOrders}</h2>
        </div>

        <div className="orders-metric-card">
          <p className="orders-metric-card__label">Completed Orders</p>
          <h2 className="orders-metric-card__value">
            {metrics.completedOrders}
          </h2>
        </div>

        <div className="orders-metric-card">
          <p className="orders-metric-card__label">Pending Orders</p>
          <h2 className="orders-metric-card__value">{metrics.pendingOrders}</h2>
        </div>

        <div className="orders-metric-card">
          <p className="orders-metric-card__label">Total Revenue</p>
          <h2 className="orders-metric-card__value">
            ${metrics.totalRevenue.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="orders-table-card">
        <div className="orders-table-card__toolbar">
          <div className="orders-filters">
            <button
              type="button"
              className={`orders-filter ${filter === "all" ? "orders-filter--active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              type="button"
              className={`orders-filter ${filter === "pending" ? "orders-filter--active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>

            <button
              type="button"
              className={`orders-filter ${filter === "completed" ? "orders-filter--active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          <div className="orders-table-card__toolbar-right">
            <span>{filteredOrders.length} orders</span>
          </div>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Fulfillment</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="orders-table__empty">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>
                    <td>{order.order_date || "N/A"}</td>
                    <td>{getCustomerName(order)}</td>
                    <td>
                      <span className={getPaymentBadgeClass(order)}>
                        {order.payment_status || order.status || "N/A"}
                      </span>
                    </td>
                    <td>{getTotal(order)}</td>
                    <td>
                      <span className={getFulfillmentBadgeClass(order)}>
                        {order.fulfillment_status || order.status || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
