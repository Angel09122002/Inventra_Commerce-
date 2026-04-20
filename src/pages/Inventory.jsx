import { useEffect, useMemo, useState } from "react";
import API_URL from "../config/api";
import "./Inventory.css";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/inventory`);

        if (!response.ok) {
          throw new Error("Could not load inventory");
        }

        const result = await response.json();
        setInventory(result.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const metrics = useMemo(() => {
    const totalItems = inventory.length;
    const lowStock = inventory.filter(
      (item) => Number(item.current_stock) < 5,
    ).length;
    const healthyStock = inventory.filter(
      (item) => Number(item.current_stock) >= 5,
    ).length;
    const totalUnits = inventory.reduce(
      (sum, item) => sum + (Number(item.current_stock) || 0),
      0,
    );

    return {
      totalItems,
      lowStock,
      healthyStock,
      totalUnits,
    };
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return inventory;

    return inventory.filter((item) => {
      return (
        String(item.name || "")
          .toLowerCase()
          .includes(term) ||
        String(item.sku || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [inventory, search]);

  const getStockClass = (stock) => {
    const value = Number(stock) || 0;
    if (value < 5) return "inventory-badge inventory-badge--danger";
    if (value < 15) return "inventory-badge inventory-badge--warning";
    return "inventory-badge inventory-badge--success";
  };

  const getStockLabel = (stock) => {
    const value = Number(stock) || 0;
    if (value < 5) return "Low";
    if (value < 15) return "Medium";
    return "Healthy";
  };

  if (loading) {
    return (
      <section className="inventory-page">
        <div className="inventory-page__status">Loading inventory...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="inventory-page">
        <div className="inventory-page__status inventory-page__status--error">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="inventory-page">
      <div className="inventory-page__header">
        <div>
          <p className="inventory-page__eyebrow">Stock</p>
          <h1 className="inventory-page__title">Inventory</h1>
          <p className="inventory-page__subtitle">
            Monitor product stock levels and quickly identify low inventory
            items.
          </p>
        </div>

        {/* <div className="inventory-page__actions">
          <button
            className="inventory-page__button inventory-page__button--ghost"
            type="button"
          >
            Export
          </button>
          <button className="inventory-page__button" type="button">
            Update Stock
          </button>
        </div> */}
      </div>

      <div className="inventory-summary">
        <div className="inventory-summary__item">
          <span className="inventory-summary__label">Products</span>
          <strong className="inventory-summary__value">
            {metrics.totalItems}
          </strong>
        </div>

        <div className="inventory-summary__item">
          <span className="inventory-summary__label">Low Stock</span>
          <strong className="inventory-summary__value">
            {metrics.lowStock}
          </strong>
        </div>

        <div className="inventory-summary__item">
          <span className="inventory-summary__label">Healthy Stock</span>
          <strong className="inventory-summary__value">
            {metrics.healthyStock}
          </strong>
        </div>

        <div className="inventory-summary__item">
          <span className="inventory-summary__label">Total Units</span>
          <strong className="inventory-summary__value">
            {metrics.totalUnits}
          </strong>
        </div>
      </div>

      <div className="inventory-table-card">
        <div className="inventory-table-card__toolbar">
          <div className="inventory-search">
            <input
              type="text"
              placeholder="Search inventory"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="inventory-search__input"
            />
          </div>

          <div className="inventory-table-card__toolbar-right">
            <span>{filteredInventory.length} items</span>
          </div>
        </div>

        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Current Stock</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="inventory-table__empty">
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.product_id}>
                    <td>{item.name || "N/A"}</td>
                    <td>{item.sku || "N/A"}</td>
                    <td>
                      {item.price != null
                        ? `$${Number(item.price).toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td>{item.current_stock ?? "N/A"}</td>
                    <td>
                      <span className={getStockClass(item.current_stock)}>
                        {getStockLabel(item.current_stock)}
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
