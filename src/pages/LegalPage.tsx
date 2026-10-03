import { Link } from 'react-router-dom'
import { legal } from '../config/legal'

export function LegalPage() {
  return (
    <article className="glass-panel legal-page">
      <span className="section-kicker">Informations du site</span>
      <h1>Mentions légales</h1>
      <p>Ce portfolio personnel présente le parcours et les projets de {legal.publisher}. Il ne propose ni vente en ligne ni prestation commerciale.</p>
      <section>
        <h2>Éditeur et publication</h2>
        <p>Éditeur et directeur de la publication : {legal.publisher}.</p>
        <p>Contact : <a href={`mailto:${legal.email}`}>{legal.email}</a>.</p>
        <p>Le site est édité à titre non professionnel. Les coordonnées personnelles de l’éditeur ne sont pas publiées,
          conformément à l’article 1-1, II de la loi pour la confiance dans l’économie numérique,
          sous réserve de leur communication à l’hébergeur.</p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>{legal.host}<br />{legal.hostAddress}<br />Téléphone : <a href="tel:+33970808911">{legal.hostPhone}</a>.</p>
        <p>Le VPS est hébergé en {legal.hostingCountry}. <a href={legal.hostLegalUrl} target="_blank" rel="noreferrer">Coordonnées officielles de l’hébergeur</a>.</p>
      </section>
      <section>
        <h2>Contenus et propriété intellectuelle</h2>
        <p>Les textes et créations de l’éditeur sont protégés par les règles de propriété intellectuelle.
          Les marques, logos et contenus de tiers restent la propriété de leurs titulaires.
          Les dépôts de projets peuvent comporter leurs propres licences, consultables dans chaque dépôt.</p>
      </section>
      <section>
        <h2>Contact et signalement</h2>
        <p>Pour signaler une erreur, un contenu ou exercer un droit de réponse, contactez l’éditeur à l’adresse ci-dessus,
          en précisant la page concernée et votre demande.</p>
        <p>Les applications présentées dans la rubrique Projets sont des services distincts : leurs traitements de données
          doivent être décrits dans leurs propres informations de confidentialité.</p>
      </section>
      <p><Link to="/confidentialite">Consulter la politique de confidentialité</Link></p>
    </article>
  )
}
