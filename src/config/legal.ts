export const legal = {
  publisher: 'Quentin Bouchot',
  email: 'bouchotquentin0603@gmail.com',
  host: 'IONOS SARL',
  hostAddress: '7, place de la Gare — BP 70109 — 57200 Sarreguemines Cedex — France',
  hostPhone: '0970 808 911',
  hostLegalUrl: 'https://www.ionos.fr/terms-gtc/terms-imprint',
  hostingCountry: 'Allemagne',
  // Applied by the retention service and log rotation in docker-compose.prod.yml.
  analyticsRetention: '6 mois pour les événements, avec une purge quotidienne ; les métadonnées d’une session sont supprimées lorsqu’aucun événement récent ne s’y rattache',
  logsRetention: 'jusqu’à leur remplacement par rotation, dans la limite de 3 fichiers de 10 Mo par service ; les journaux ne sont pas utilisés pour mesurer l’audience',
}
