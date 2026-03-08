import "./InfoCard.css";

export default function InfoCard({ title, fields = [] }) {
  return (
    <article className="info-card">
      <h2 className="info-card__title">{title}</h2>

      <div className="info-card__fields">
        {fields.map((field, index) => (
          <p className="info-card__field" key={index}>
            <strong>{field.label}:</strong> {field.value}
          </p>
        ))}
      </div>
    </article>
  );
}
