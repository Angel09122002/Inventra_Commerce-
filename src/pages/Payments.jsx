import { useEffect, useState } from "react";
import InfoCard from "../components/InfoCard";
export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/payments");
        if (!response.ok) throw new Error("Failed to fetch payments");

        const result = await response.json();
        setPayments(result.data || []);
      } catch (err) {
        setError("Could not load payments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <h1>Loading payments...</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <section style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>Payments</h1>

      {payments.map((payment, index) => (
        <InfoCard
          key={payment.payment_id ?? index}
          title={`Payment ${payment.payment_id ?? index + 1}`}
          fields={Object.entries(payment).map(([key, value]) => ({
            label: key,
            value: String(value),
          }))}
        />
      ))}
    </section>
  );
}
