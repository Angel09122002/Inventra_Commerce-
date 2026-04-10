import "./InfoCard.css";

export default function InfoCard({ title, fields = [] }) {
  return (
    <article className="info-card">
      <h2 className="info-card__title">{title}</h2>
      <div className="info-card__fields">
        {fields.map((field, index) => (
          <p className="info-card__field" key={index}>
            <span className="info-card__label">{field.label}:</span>
            <span className="info-card__value">{field.value}</span>
          </p>
        ))}
      </div>
    </article>
  );
}
