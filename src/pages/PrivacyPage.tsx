import { legal } from '../config/legal'
import { ANALYTICS_CONFIGURED } from '../utils/privacy'

export function PrivacyPage() {
  return (
    <article className="legal-page">
      <span className="section-kicker">Données personnelles</span>
      <h1>Confidentialité</h1>
      <p>
        Cette politique concerne le portfolio et explique les informations utilisées lors de votre visite.
      </p>
      <section>
        <h2>Responsable et contact</h2>
        <p>
          {legal.publisher} est responsable des traitements décrits ici. Pour toute question ou demande
          relative à vos données : <a href={`mailto:${legal.email}`}>{legal.email}</a>.
        </p>
      </section>
      <section>
        <h2>Fonctionnement du site et contact par email</h2>
        <p>
          Les requêtes adressées au serveur transmettent notamment votre adresse IP et des informations
          techniques du navigateur. Elles servent à fournir les pages, à diagnostiquer les erreurs et à
          protéger le site. La base légale est l’intérêt légitime de l’éditeur à maintenir un site disponible
          et sécurisé. L’éditeur et son hébergeur IONOS peuvent accéder aux données techniques nécessaires.
        </p>
        <p>
          Conservation des journaux :{' '}
          {legal.logsRetention ??
            'la durée effective doit encore être vérifiée auprès de l’administrateur et de l’hébergeur'}
          .
        </p>
        <p>
          Si vous contactez l’éditeur par email, votre adresse et le contenu de votre message servent à
          répondre à votre demande, sur la base de l’intérêt légitime à traiter les échanges reçus. Ils sont
          conservés pendant le traitement de la demande, puis supprimés lorsqu’ils ne sont plus nécessaires,
          sauf obligation légale ou nécessité liée à un litige. Les destinataires sont l’éditeur et le service
          de messagerie Gmail (Google).{' '}
          <a href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noreferrer">
            Politique de confidentialité de Google
          </a>{' '}
          : ce fournisseur peut traiter des données hors de l’Union européenne selon les garanties décrites
          dans cette politique.
        </p>
      </section>
      <section>
        <h2>Statistiques de fréquentation</h2>
        {ANALYTICS_CONFIGURED ? (
          <>
            <p>
              Umami est hébergé sur le VPS du site en {legal.hostingCountry}. Il est chargé uniquement après
              votre accord. Il mesure les pages consultées, la provenance de la visite, les caractéristiques
              du navigateur et de l’appareil, ainsi que certaines interactions, comme le changement de thème
              ou le téléchargement du CV. Des identifiants aléatoires de visiteur et de session peuvent être
              utilisés pour relier ces interactions. Le contenu de vos emails n’est pas envoyé à Umami.
            </p>
            <p>
              La base légale est votre consentement. Les statistiques sont accessibles à l’éditeur et à son
              hébergeur pour les opérations techniques. Conservation :{' '}
              {legal.analyticsRetention ?? 'la durée de conservation en base reste à définir et à appliquer'}.
            </p>
            <p>
              Vous pouvez accepter, refuser ou retirer votre accord depuis « Préférences de confidentialité »
              dans le pied de page. Le refus ne limite pas l’accès au portfolio. Le retrait arrête les
              collectes futures ; pour demander la suppression des données déjà collectées, contactez
              l’éditeur.
            </p>
          </>
        ) : (
          <p>La mesure d’audience n’est pas activée sur cette version du site.</p>
        )}
      </section>
      <section>
        <h2>Stockage dans votre navigateur</h2>
        <ul>
          <li>
            Préférence de thème : stockée localement pour conserver le mode choisi, jusqu’à modification ou
            suppression des données du site dans votre navigateur.
          </li>
          <li>
            Choix de confidentialité : conservé 180 jours afin de respecter votre accord ou votre refus.
          </li>
          <li>
            Identifiant de visiteur : créé uniquement avec votre accord pour les statistiques, supprimé lors
            du refus ou de l’expiration du choix constatée à la prochaine visite.
          </li>
          <li>
            Identifiant de session : créé uniquement avec votre accord, conservé dans le stockage de session
            du navigateur.
          </li>
          <li>
            README des projets : conservés uniquement en mémoire pendant la visite ; ils sont récupérés à
            nouveau lors d’une nouvelle ouverture du site.
          </li>
        </ul>
        <p>
          Vous pouvez effacer ces informations dans les paramètres de votre navigateur. Effacer le choix de
          confidentialité entraîne une nouvelle demande avant toute mesure d’audience.
        </p>
      </section>
      <section>
        <h2>Services externes</h2>
        <p>
          Le CV et les présentations de projets sont récupérés depuis GitHub, via raw.githubusercontent.com.
          Ces appels servent à afficher des contenus à jour, sur la base de l’intérêt légitime de l’éditeur à
          présenter son portfolio. Ces requêtes transmettent à GitHub votre adresse IP et des informations
          techniques du navigateur. Ce fournisseur peut traiter ces données hors de l’Union européenne selon
          ses propres garanties et conditions.{' '}
          <a
            href="https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement"
            target="_blank"
            rel="noreferrer"
          >
            Politique de confidentialité de GitHub
          </a>
          .
        </p>
        <p>
          Les liens vers LinkedIn, GitHub et les applications de projets ouvrent des services dont les propres
          politiques s’appliquent.
        </p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>
          Selon le traitement et les conditions prévues par le RGPD, vous pouvez demander l’accès, la
          rectification, l’effacement ou la limitation de vos données, vous opposer aux traitements fondés sur
          l’intérêt légitime, retirer votre consentement et demander la portabilité lorsque celle-ci
          s’applique. Écrivez à l’adresse de contact en précisant votre demande. Une preuve d’identité peut
          être demandée uniquement en cas de doute raisonnable.
        </p>
        <p>
          Vous pouvez également adresser une réclamation à la{' '}
          <a href="https://www.cnil.fr/fr/adresser-une-plainte" target="_blank" rel="noreferrer">
            CNIL
          </a>
          .
        </p>
      </section>
    </article>
  )
}
