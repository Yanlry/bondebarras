import { LegalDocument } from '../../components/LegalDocument'
import { LegalFields } from '../../components/LegalFields'

/**
 * /confidentialite : projet de politique de confidentialité. Les données
 * listées sont celles que demande réellement le formulaire ; les éléments qui
 * dépendent de choix non faits (prestataire d'envoi, durée de conservation…)
 * sont signalés « À compléter ».
 */
export function PrivacyPage() {
  return (
    <LegalDocument page="confidentialite" title="Politique de confidentialité">
      <section aria-labelledby="pc-responsable">
        <h2 id="pc-responsable">Responsable du traitement</h2>
        <LegalFields
          fields={[
            { label: 'Responsable', value: null },
            { label: 'Contact pour vos données', value: null },
          ]}
        />
      </section>
      <section aria-labelledby="pc-donnees">
        <h2 id="pc-donnees">Données collectées</h2>
        <p>Le formulaire de devis demande :</p>
        <ul>
          <li>votre profil (particulier ou professionnel) et le type de débarras ;</li>
          <li>votre nom, votre téléphone et / ou votre adresse e-mail ;</li>
          <li>le code postal et la ville du lieu concerné ;</li>
          <li>la description de votre besoin et, si vous le souhaitez, une date ;</li>
        </ul>
        <p>L’envoi de photographies sera décrit ici s’il est proposé.</p>
      </section>
      <section aria-labelledby="pc-finalite">
        <h2 id="pc-finalite">Finalité et base légale</h2>
        <p>
          Ces informations servent uniquement à répondre à votre demande de devis et à vous recontacter à son sujet. Base légale envisagée :
          les mesures précontractuelles prises à votre demande, avec votre accord exprimé par la case à cocher du formulaire (à valider).
        </p>
      </section>
      <section aria-labelledby="pc-destinataires">
        <h2 id="pc-destinataires">Destinataires et conservation</h2>
        <LegalFields
          fields={[
            { label: 'Destinataires', value: 'Bon Débarras' },
            { label: 'Prestataire d’envoi du formulaire', value: null },
            { label: 'Durée de conservation', value: null },
          ]}
        />
      </section>
      <section aria-labelledby="pc-droits">
        <h2 id="pc-droits">Vos droits</h2>
        <p>
          Vous pouvez demander l’accès à vos données, leur rectification, leur effacement, la limitation de leur traitement, vous y opposer ou
          demander leur portabilité, en écrivant au contact indiqué ci-dessus (à compléter). Vous pouvez aussi adresser une réclamation à la
          CNIL (cnil.fr).
        </p>
      </section>
      <section aria-labelledby="pc-cookies">
        <h2 id="pc-cookies">Cookies</h2>
        <p>À ce jour, ce site ne dépose aucun cookie ni traceur de mesure d’audience.</p>
      </section>
    </LegalDocument>
  )
}
