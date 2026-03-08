import { useEffect, useState } from "react";
import InfoCard from "../components/InfoCard";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/customers");
        if (!response.ok) throw new Error("Failed to fetch customers");

        const result = await response.json();
        setCustomers(result.data || []);
      } catch (err) {
        setError("Could not load customers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <h1>Loading customers...</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <section style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>Customers</h1>

      {customers.map((customer, index) => (
        <InfoCard
          key={customer.customer_id ?? index}
          title={customer.name || customer.full_name || `Customer ${index + 1}`}
          fields={Object.entries(customer).map(([key, value]) => ({
            label: key,
            value: String(value),
          }))}
        />
      ))}
    </section>
  );
}
