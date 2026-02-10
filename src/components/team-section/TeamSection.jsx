import { useTranslation } from 'react-i18next'
import './team-section.css'

// Image filenames: place photos in public/team/ (e.g. mayassa-takrouni.jpg)
const TEAM = [
  { name: 'Mayassa Takrouni', roleKey: 'team.coPresident', description: '', image: 'mayassa-takrouni.jpg' },
  { name: 'Safiya Sillah', roleKey: 'team.coPresident', description: '', image: 'safiya-sillah.jpg' },
  { name: 'Aleena Anas', roleKey: 'team.vpInternal', description: '', image: 'aleena-anas.jpg' },
  { name: 'Camélia Bakouri', roleKey: 'team.vpExternal', description: '', image: 'camelia-bakouri.jpg' },
  { name: 'Cathy Ndiaye', roleKey: 'team.vpFinance', description: '', image: 'cathy-ndiaye.jpg' },
  { name: 'Adina Macklin', roleKey: 'team.vpEvents', description: '', image: 'adina-macklin.jpg' },
  { name: 'Ines Taleb', roleKey: 'team.vpInternships', description: '', image: 'ines-taleb.jpg' },
  { name: 'McLain Boege', roleKey: 'team.vpAcademics', description: '', image: 'mclain-boege.jpg' },
]

const TeamCard = ({ name, role, description, image }) => (
  <article className="team-card">
    <div className="team-card-image">
      {image ? (
        <img
          src={`/team/${image}`}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      ) : null}
    </div>
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
          <TeamCard key={i} name={person.name} role={t(person.roleKey)} description={person.description} image={person.image} />
        ))}
      </div>
      <div className="team-section-row">
        {row2.map((person, i) => (
          <TeamCard key={i} name={person.name} role={t(person.roleKey)} description={person.description} image={person.image} />
        ))}
      </div>
      <div className="team-section-row">
        {row3.map((person, i) => (
          <TeamCard key={i} name={person.name} role={t(person.roleKey)} description={person.description} image={person.image} />
        ))}
      </div>
    </section>
  )
}

export default TeamSection
