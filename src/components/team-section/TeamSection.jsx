import './team-section.css'

const TEAM = [
  { name: 'Mayassa Takrouni', role: 'Co-President', description: '' },
  { name: 'Safiya Sillah', role: 'Co-President', description: '' },
  { name: 'Aleena Anas', role: 'VP Internal', description: '' },
  { name: 'Camélia Bakouri', role: 'VP External', description: '' },
  { name: 'Cathy Ndiaye', role: 'VP Finance', description: '' },
  { name: 'Adina Macklin', role: 'VP Events', description: '' },
  { name: 'Ines Taleb', role: 'VP Internships & Exchanges', description: '' },
  { name: 'McLain Boege', role: 'VP Academics', description: '' },
]

const TeamCard = ({ name, role, description }) => (
  <article className="team-card">
    <div className="team-card-image" aria-hidden />
    <h3 className="team-card-name">{name}</h3>
    <p className="team-card-role">{role}</p>
    {description && <p className="team-card-description">{description}</p>}
  </article>
)

const TeamSection = () => {
  const coPresidents = TEAM.slice(0, 2)
  const row2 = TEAM.slice(2, 5)
  const row3 = TEAM.slice(5, 8)

  return (
    <section className="team-section">
      <h2 className="team-section-title">Our Team</h2>
      <div className="team-section-row team-section-row--presidents">
        {coPresidents.map((person, i) => (
          <TeamCard key={i} name={person.name} role={person.role} description={person.description} />
        ))}
      </div>
      <div className="team-section-row">
        {row2.map((person, i) => (
          <TeamCard key={i} name={person.name} role={person.role} description={person.description} />
        ))}
      </div>
      <div className="team-section-row">
        {row3.map((person, i) => (
          <TeamCard key={i} name={person.name} role={person.role} description={person.description} />
        ))}
      </div>
    </section>
  )
}

export default TeamSection
