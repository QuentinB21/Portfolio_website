import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { initializeAnalytics } from '../utils/analytics'
import { ANALYTICS_CONFIGURED, CONSENT_KEY, clearAnalyticsIdentifiers, readPrivacyChoice, readPrivacyPreference, savePrivacyChoice, type PrivacyChoice } from '../utils/privacy'

export function PrivacyControls() {
  const [choice, setChoice] = useState(readPrivacyChoice)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    let timer: number | undefined
    const syncChoice = () => {
      const next = readPrivacyChoice()
      if (choice === 'accepted' && next !== 'accepted') {
        clearAnalyticsIdentifiers()
        window.location.reload()
        return
      }
      setChoice(next)
      if (next === 'accepted') initializeAnalytics()
    }
    const scheduleExpiry = () => {
      window.clearTimeout(timer)
      const preference = readPrivacyPreference()
      if (!preference) return
      // Browser timers are limited to about 24 days; re-arm long expirations.
      timer = window.setTimeout(() => {
        syncChoice()
        scheduleExpiry()
      }, Math.min(preference.expiresAt - Date.now() + 1, 2_147_483_647))
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) {
        syncChoice()
        scheduleExpiry()
      }
    }
    scheduleExpiry()
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', syncChoice)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', syncChoice)
    }
  }, [choice])

  const choose = (next: PrivacyChoice) => {
    const wasAccepted = choice === 'accepted' || Boolean(document.querySelector('script[data-umami-script="true"]'))
    savePrivacyChoice(next)
    setChoice(readPrivacyChoice())
    dialogRef.current?.close()
    if (wasAccepted && next === 'refused') {
      // Reloading also stops the analytics script's automatic page tracking.
      window.location.reload()
    } else if (next === 'accepted') {
      initializeAnalytics()
    }
  }

  const details = (
    <>
      <p>Avec votre accord, Umami mesure la fréquentation et les interactions sur ce portfolio.
        Refuser ne limite pas l’accès au site. Votre choix est conservé pendant 180 jours et peut être modifié ici à tout moment.</p>
      <p>La préférence de thème reste disponible indépendamment de ce choix. <Link to="/confidentialite" onClick={() => { dialogRef.current?.close(); window.scrollTo({ top: 0, behavior: 'instant' }) }}>En savoir plus sur les données personnelles</Link>.</p>
      <div className="privacy-actions">
        <button className="secondary-button" type="button" onClick={() => choose('refused')}>Refuser les statistiques</button>
        <button className="secondary-button" type="button" onClick={() => choose('accepted')}>Accepter les statistiques</button>
      </div>
    </>
  )

  return (
    <>
      <button className="footer-link" type="button" onClick={() => dialogRef.current?.showModal()}>Préférences de confidentialité</button>
      {ANALYTICS_CONFIGURED && choice === null && (
        <aside className="privacy-banner glass-panel" aria-labelledby="privacy-banner-title">
          <h2 id="privacy-banner-title">Votre confidentialité</h2>
          {details}
        </aside>
      )}
      <dialog className="privacy-dialog" ref={dialogRef} aria-labelledby="privacy-dialog-title">
        <h2 id="privacy-dialog-title">Préférences de confidentialité</h2>
        {ANALYTICS_CONFIGURED ? <><p>Statistiques : {choice === 'accepted' ? 'acceptées' : choice === 'refused' ? 'refusées' : 'en attente de votre choix'}.</p>{details}</> : <p>La mesure d’audience n’est pas activée sur cette version du site. Seule votre préférence de thème peut être mémorisée dans le navigateur.</p>}
        <button className="secondary-button" type="button" onClick={() => dialogRef.current?.close()}>Fermer</button>
      </dialog>
    </>
  )
}
