import { useEffect, useMemo, useState } from "react";
import "./Customers.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, ordersRes] = await Promise.all([
          fetch("http://localhost:5000/api/customers"),
          fetch("http://localhost:5000/api/orders"),
        ]);

        if (!customersRes.ok || !ordersRes.ok) {
          throw new Error("Could not load customers");
        }

        const [customersData, ordersData] = await Promise.all([
          customersRes.json(),
          ordersRes.json(),
        ]);

        setCustomers(customersData.data || []);
        setOrders(ordersData.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const customerOrderMap = useMemo(() => {
    const map = {};

    orders.forEach((order) => {
      const customerId = order.customer_id;
      const total =
        Number(order.total_amount) ||
        Number(order.amount) ||
        Number(order.total) ||
        0;

      if (!map[customerId]) {
        map[customerId] = {
          orders: 0,
          amountSpent: 0,
        };
      }

      map[customerId].orders += 1;
      map[customerId].amountSpent += total;
    });

    return map;
  }, [orders]);

  const enrichedCustomers = useMemo(() => {
    return customers.map((customer) => {
      const stats = customerOrderMap[customer.customer_id] || {
        orders: 0,
        amountSpent: 0,
      };

      const fullName =
        customer.customer_name ||
        `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
        "Unknown Customer";

      const location =
        customer.city ||
        customer.location ||
        [customer.address, customer.state].filter(Boolean).join(", ") ||
        "N/A";

      let status = "Subscribed";

      if (stats.orders === 0) {
        status = "Pending";
      } else if (stats.amountSpent === 0) {
        status = "Not Subscribed";
      }

      return {
        ...customer,
        fullName,
        location,
        orderCount: stats.orders,
        amountSpent: stats.amountSpent,
        status,
      };
    });
  }, [customers, customerOrderMap]);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return enrichedCustomers;

    return enrichedCustomers.filter((customer) => {
      return (
        customer.fullName.toLowerCase().includes(term) ||
        String(customer.email || "")
          .toLowerCase()
          .includes(term) ||
        String(customer.location || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [enrichedCustomers, search]);

  const totalSpent = enrichedCustomers.reduce(
    (sum, customer) => sum + customer.amountSpent,
    0,
  );

  const subscribedCount = enrichedCustomers.filter(
    (customer) => customer.status === "Subscribed",
  ).length;

  const getStatusClass = (status) => {
    const value = status.toLowerCase();

    if (value.includes("subscribed")) {
      return "customers-badge customers-badge--success";
    }

    if (value.includes("pending")) {
      return "customers-badge customers-badge--warning";
    }

    if (value.includes("not")) {
      return "customers-badge customers-badge--danger";
    }

    return "customers-badge customers-badge--neutral";
  };

  if (loading) {
    return (
      <section className="customers-page">
        <div className="customers-page__status">Loading customers...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="customers-page">
        <div className="customers-page__status customers-page__status--error">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="customers-page">
      <div className="customers-page__header">
        <div>
          <p className="customers-page__eyebrow">Audience</p>
          <h1 className="customers-page__title">Customers</h1>
          <p className="customers-page__subtitle">
            Review your customer list, their order activity, and total amount
            spent.
          </p>
        </div>

        {/* <div className="customers-page__actions">
          <button
            className="customers-page__button customers-page__button--ghost"
            type="button"
          >
            Export
          </button>
          <button className="customers-page__button" type="button">
            Add Customer
          </button>
        </div> */}
      </div>

      <div className="customers-summary">
        <div className="customers-summary__item">
          <span className="customers-summary__label">Total Customers</span>
          <strong className="customers-summary__value">
            {enrichedCustomers.length}
          </strong>
        </div>

        <div className="customers-summary__item">
          <span className="customers-summary__label">Subscribed</span>
          <strong className="customers-summary__value">
            {subscribedCount}
          </strong>
        </div>

        <div className="customers-summary__item">
          <span className="customers-summary__label">Amount Spent</span>
          <strong className="customers-summary__value">
            ${totalSpent.toFixed(2)}
          </strong>
        </div>
      </div>

      <div className="customers-table-card">
        <div className="customers-table-card__toolbar">
          <div className="customers-search">
            <input
              type="text"
              placeholder="Search customer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="customers-search__input"
            />
          </div>

          <div className="customers-table-card__toolbar-right">
            <span>{filteredCustomers.length} customers</span>
          </div>
        </div>

        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Status</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Amount Spent</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="customers-table__empty">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td>
                      <div className="customers-person">
                        <div className="customers-person__avatar">
                          {customer.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span>{customer.fullName}</span>
                      </div>
                    </td>
                    <td>{customer.email || "N/A"}</td>
                    <td>
                      <span className={getStatusClass(customer.status)}>
                        {customer.status}
                      </span>
                    </td>
                    <td>{customer.location}</td>
                    <td>{customer.orderCount} Orders</td>
                    <td>${customer.amountSpent.toFixed(2)}</td>
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
