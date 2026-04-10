import { useEffect, useMemo, useState } from "react";
import "./Payments.css";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/payments");

        if (!response.ok) {
          throw new Error("Could not load payments");
        }

        const result = await response.json();
        setPayments(result.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const metrics = useMemo(() => {
    const totalPayments = payments.length;
    const completed = payments.filter((payment) =>
      String(payment.status || "")
        .toLowerCase()
        .includes("complete"),
    ).length;
    const pending = payments.filter((payment) =>
      String(payment.status || "")
        .toLowerCase()
        .includes("pending"),
    ).length;
    const totalAmount = payments.reduce(
      (sum, payment) => sum + (Number(payment.amount) || 0),
      0,
    );

    return {
      totalPayments,
      completed,
      pending,
      totalAmount,
    };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return payments;

    return payments.filter((payment) => {
      return (
        String(payment.payment_id || "")
          .toLowerCase()
          .includes(term) ||
        String(payment.order_id || "")
          .toLowerCase()
          .includes(term) ||
        String(payment.method || "")
          .toLowerCase()
          .includes(term) ||
        String(payment.status || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [payments, search]);

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();
    if (value.includes("complete") || value.includes("success")) {
      return "payments-badge payments-badge--success";
    }
    if (value.includes("pending")) {
      return "payments-badge payments-badge--warning";
    }
    if (value.includes("failed") || value.includes("cancel")) {
      return "payments-badge payments-badge--danger";
    }
    return "payments-badge payments-badge--neutral";
  };

  if (loading) {
    return (
      <section className="payments-page">
        <div className="payments-page__status">Loading payments...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="payments-page">
        <div className="payments-page__status payments-page__status--error">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="payments-page">
      <div className="payments-page__header">
        <div>
          <p className="payments-page__eyebrow">Finance</p>
          <h1 className="payments-page__title">Payments</h1>
          <p className="payments-page__subtitle">
            Review payment activity, statuses, and amounts across recent orders.
          </p>
        </div>

        {/* <div className="payments-page__actions">
          <button
            className="payments-page__button payments-page__button--ghost"
            type="button"
          >
            Export
          </button>
          <button className="payments-page__button" type="button">
            Add Payment
          </button>
        </div> */}
      </div>

      <div className="payments-summary">
        <div className="payments-summary__item">
          <span className="payments-summary__label">Total Payments</span>
          <strong className="payments-summary__value">
            {metrics.totalPayments}
          </strong>
        </div>

        <div className="payments-summary__item">
          <span className="payments-summary__label">Completed</span>
          <strong className="payments-summary__value">
            {metrics.completed}
          </strong>
        </div>

        <div className="payments-summary__item">
          <span className="payments-summary__label">Pending</span>
          <strong className="payments-summary__value">{metrics.pending}</strong>
        </div>

        <div className="payments-summary__item">
          <span className="payments-summary__label">Total Amount</span>
          <strong className="payments-summary__value">
            ${metrics.totalAmount.toFixed(2)}
          </strong>
        </div>
      </div>

      <div className="payments-table-card">
        <div className="payments-table-card__toolbar">
          <div className="payments-search">
            <input
              type="text"
              placeholder="Search payments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="payments-search__input"
            />
          </div>

          <div className="payments-table-card__toolbar-right">
            <span>{filteredPayments.length} payments</span>
          </div>
        </div>

        <div className="payments-table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="payments-table__empty">
                    No payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.payment_id}>
                    <td>#{payment.payment_id}</td>
                    <td>#{payment.order_id}</td>
                    <td>${Number(payment.amount || 0).toFixed(2)}</td>
                    <td>{payment.payment_date || "N/A"}</td>
                    <td>{payment.method || "N/A"}</td>
                    <td>
                      <span className={getStatusClass(payment.status)}>
                        {payment.status || "N/A"}
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
