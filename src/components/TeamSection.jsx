import "./TeamSection.css";

const teamMembers = [
  {
    name: "Angel Quintero",
    role: "Frontend Development, UI Design, API Integration",
    initials: "AQ",
  },
  {
    name: "Fabio Casal",
    role: "Backend Development, Database Design, SQL Implementation",
    initials: "FC",
  },
  {
    name: "Justin Wissart",
    role: "Backend Development, Validation & Database Support",
    initials: "JW",
  },
  {
    name: "Steven Gutierrez",
    role: "Database Design (Customer Entity, Fields & Constraints)",
    initials: "SG",
  },
];

export default function TeamSection() {
  return (
    <section className="team-section">
      <div className="team-section__header">
        <p className="team-section__eyebrow">Project Team</p>
        <h2 className="team-section__title">Who Participated</h2>
        <p className="team-section__subtitle">
          Meet the team members who contributed to Inventra Commerce.
        </p>
      </div>

      <div className="team-section__grid">
        {teamMembers.map((member, index) => (
          <article
            className="team-card"
            key={member.name}
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <div className="team-card__avatar">{member.initials}</div>

            <div className="team-card__content">
              <h3 className="team-card__name">{member.name}</h3>
              <p className="team-card__role">{member.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
