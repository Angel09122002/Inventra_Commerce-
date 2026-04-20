import { useEffect, useState } from "react";
import API_URL from "../config/api";
import "./Products.css";

const DEFAULT_PRODUCT_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7c3aed"/>
          <stop offset="50%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
      </defs>
      <rect width="600" height="400" rx="24" fill="url(#bg)"/>
      <circle cx="470" cy="95" r="34" fill="rgba(255,255,255,0.35)"/>
      <rect x="90" y="110" width="210" height="150" rx="14" fill="rgba(255,255,255,0.18)"/>
      <path d="M120 250 L220 150 L280 230 L340 170 L420 250 Z" fill="rgba(255,255,255,0.22)"/>
      <text x="50%" y="88%" text-anchor="middle" fill="white" font-size="28" font-family="Arial, sans-serif">
        Product Image
      </text>
    </svg>
  `);

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
          throw new Error("Could not load products");
        }

        const result = await response.json();
        setProducts(result.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="products-page">
        <div className="products-page__status">Loading products...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-page">
        <div className="products-page__status products-page__status--error">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="products-page">
      <div className="products-page__header">
        <p className="products-page__eyebrow">Catalog</p>
        <h1 className="products-page__title">Products</h1>
        <p className="products-page__subtitle">
          Browse your current product inventory.
        </p>
      </div>

      <div className="products-grid">
        {products.map((product, index) => (
          <article className="product-card" key={product.product_id || index}>
            <div className="product-card__image-wrap">
              <img
                src={product.image || DEFAULT_PRODUCT_IMAGE}
                alt={product.name || "Product"}
                className="product-card__image"
              />
            </div>

            <div className="product-card__content">
              <h2 className="product-card__title">
                {product.name || `Product #${index + 1}`}
              </h2>

              {product.description && (
                <p className="product-card__description">
                  {product.description}
                </p>
              )}

              <div className="product-card__meta">
                <div className="product-card__row">
                  <span className="product-card__label">SKU</span>
                  <span className="product-card__value">
                    {product.sku || "N/A"}
                  </span>
                </div>

                <div className="product-card__row">
                  <span className="product-card__label">Price</span>
                  <span className="product-card__value">
                    {product.price != null
                      ? `$${Number(product.price).toFixed(2)}`
                      : "N/A"}
                  </span>
                </div>

                {"stock" in product && (
                  <div className="product-card__row">
                    <span className="product-card__label">Stock</span>
                    <span className="product-card__value">{product.stock}</span>
                  </div>
                )}

                {"current_stock" in product && (
                  <div className="product-card__row">
                    <span className="product-card__label">Current Stock</span>
                    <span className="product-card__value">
                      {product.current_stock}
                    </span>
                  </div>
                )}

                {"category" in product && product.category && (
                  <div className="product-card__row">
                    <span className="product-card__label">Category</span>
                    <span className="product-card__value">
                      {product.category}
                    </span>
                  </div>
                )}
              </div>

              <button className="product-card__button" type="button">
                View Product
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
