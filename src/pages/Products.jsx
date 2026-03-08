import { useEffect, useState } from "react";
import InfoCard from "../components/InfoCard.jsx";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const result = await response.json();
        setProducts(result.data || []);
      } catch (err) {
        setError("Could not load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h1>Loading products...</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <section className="products-page">
      <h1 className="products-page__title">Products</h1>

      <div className="products-page__grid">
        {products.map((product, index) => (
          <InfoCard
            key={product.product_id ?? index}
            title={product.name || `Product ${index + 1}`}
            fields={[
              { label: "SKU", value: product.sku },
              { label: "Price", value: `$${product.price}` },
              { label: "Stock", value: product.current_stock },
            ]}
          />
        ))}
      </div>
    </section>
  );
}
