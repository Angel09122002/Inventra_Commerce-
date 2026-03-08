import { useEffect, useState } from "react";
import InfoCard from "../components/InfoCard";
export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventory");
        if (!response.ok) throw new Error("Failed to fetch inventory");

        const result = await response.json();
        setInventory(result.data || []);
      } catch (err) {
        setError("Could not load inventory");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) return <h1>Loading inventory...</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <section style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>Inventory</h1>

      {inventory.map((item, index) => (
        <InfoCard
          key={item.inventory_id ?? item.product_id ?? index}
          title={item.name || item.sku || `Inventory Item ${index + 1}`}
          fields={Object.entries(item).map(([key, value]) => ({
            label: key,
            value: String(value),
          }))}
        />
      ))}
    </section>
  );
}
