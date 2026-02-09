import { useTranslation } from 'react-i18next'
import './team-section.css'

const TEAM = [
  { name: 'Mayassa Takrouni', roleKey: 'team.coPresident', description: '' },
  { name: 'Safiya Sillah', roleKey: 'team.coPresident', description: '' },
  { name: 'Aleena Anas', roleKey: 'team.vpInternal', description: '' },
  { name: 'Camélia Bakouri', roleKey: 'team.vpExternal', description: '' },
  { name: 'Cathy Ndiaye', roleKey: 'team.vpFinance', description: '' },
  { name: 'Adina Macklin', roleKey: 'team.vpEvents', description: '' },
  { name: 'Ines Taleb', roleKey: 'team.vpInternships', description: '' },
  { name: 'McLain Boege', roleKey: 'team.vpAcademics', description: '' },
]

const TeamCard = ({ name, role, description }) => (
  <article className="team-card">
    <div className="team-card-image" aria-hidden />
    <h3 className="team-card-name">{name}</h3>
    <p className="team-card-role">{role}</p>
    {description ? <p className="team-card-description">{description}</p> : null}
  </article>
)

const TeamSection = () => {
  const { t } = useTranslation()
  const coPresidents = TEAM.slice(0, 2)
  const row2 = TEAM.slice(2, 5)
  const row3 = TEAM.slice(5, 8)

  return (
    <section className="team-section">
      <h2 className="team-section-title">{t('team.title')}</h2>
      <div className="team-section-row team-section-row--presidents">
        {coPresidents.map((person, i) => (
          <TeamCard key={i} name={person.name} role={t(person.roleKey)} description={person.description} />
        ))}
      </div>
      <div className="team-section-row">
        {row2.map((person, i) => (
          <TeamCard key={i} name={person.name} role={t(person.roleKey)} description={person.description} />
        ))}
      </div>
      <div className="team-section-row">
        {row3.map((person, i) => (
          <TeamCard key={i} name={person.name} role={t(person.roleKey)} description={person.description} />
        ))}
      </div>
    </section>
  )
}

export default TeamSection
