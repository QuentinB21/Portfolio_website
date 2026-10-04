# Mentions légales et confidentialité du portfolio

Le footer donne accès à `/mentions-legales`, `/confidentialite` et aux préférences
de confidentialité. Les données éditoriales sont dans `src/config/legal.ts`.

## Périmètre

Portfolio personnel non commercial, éditeur Quentin Bouchot, VPS IONOS en
Allemagne (informations fournies par l’éditeur). Les coordonnées publiques IONOS
proviennent de https://www.ionos.fr/terms-gtc/terms-imprint.
Vérifier que le contrat du VPS est bien porté par IONOS SARL, et non une autre
entité IONOS. L’hébergeur doit disposer des coordonnées personnelles complètes de
l’éditeur pour appliquer le régime non professionnel de l’article 1-1 II LCEN.

## Changements techniques

- Umami et les identifiants visiteur/session sont bloqués avant consentement.
- Accepter et refuser ont le même traitement visuel. Le choix expire en 180 jours.
- Le retrait efface les identifiants locaux et recharge le document pour arrêter
  aussi les événements automatiques du script Umami.
- Les polices sont servies localement avec leurs licences OFL.
- La configuration production limite chaque log Docker à 3 fichiers de 10 Mo.
- Le service `umami-retention` purge chaque jour les statistiques du seul UUID
  `VITE_UMAMI_WEBSITE_ID` âgées de plus de six mois. Il conserve comptes, sites,
  rapports et données des autres sites. Les erreurs SQL annulent la transaction.

## Avant publication de cette version

Les durées annoncées décrivent la **nouvelle configuration**, pas l’ancien VPS.
Le 3 octobre 2026, la lecture du VPS a montré des logs Docker `json-file` sans
rotation et 780 événements Umami, le plus ancien daté du 13 avril 2026. Aucune
donnée n’a été supprimée et aucun service n’a été modifié pendant cette inspection.

La requête de purge a été vérifiée sur PostgreSQL embarqué (PGlite), avec un
schéma représentatif des tables observées et des données fictives : anciennes
données du portfolio supprimées, données récentes et autres sites préservés,
session encore active conservée et UUID invalide refusé. Aucun test n’a utilisé
ou supprimé de données réelles.

Le déploiement de `docker-compose.prod.yml` active une suppression automatique
des statistiques plus anciennes que six mois : faire valider cette règle avant
de déployer et prévoir une sauvegarde avec sa propre durée de conservation.
La requête est adaptée au schéma Umami observé sur le VPS ; une évolution du schéma
doit entraîner une nouvelle validation. Vérifier les logs du service après
déploiement et prévoir une alerte sur son échec.

La rotation Docker s’applique aux conteneurs recréés. Contrôler la configuration
effective après déploiement. Les anciennes sorties Docker, sauvegardes et autres
journaux du système doivent être traités dans une politique d’exploitation
distincte, sans conservation indéfinie de données personnelles.

Confirmer le prestataire de messagerie, les durées réellement appliquées aux
emails et les éventuels transferts hors UE. GitHub reçoit les requêtes navigateur
du CV et des README ; si nécessaire, les récupérer côté serveur pour limiter les
transmissions directes. Les applications TradeCopilot et MailManager doivent avoir
leurs propres informations et contrôles de confidentialité.


## Références

- LCEN, article 1-1 : https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164
- Traceurs : https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite
- Information RGPD : https://www.cnil.fr/fr/les-modeles-de-mentions-dinformation

Ces changements ne certifient pas une conformité juridique de l’ensemble des
services hébergés ; les pratiques serveur et les informations publiées doivent
rester cohérentes.
