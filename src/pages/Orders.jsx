import { useEffect, useState } from "react";
import InfoCard from "../components/InfoCard";
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");

        const result = await response.json();
        setOrders(result.data || []);
      } catch (err) {
        setError("Could not load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <h1>Loading orders...</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <section style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>Orders</h1>

      {orders.map((order, index) => (
        <InfoCard
          key={order.order_id ?? index}
          title={`Order #${order.order_id ?? index + 1}`}
          fields={Object.entries(order).map(([key, value]) => ({
            label: key,
            value: String(value),
          }))}
        />
      ))}
    </section>
  );
}
