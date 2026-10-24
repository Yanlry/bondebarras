import { LegalDocument } from '../../components/LegalDocument'
import { LegalFields } from '../../components/LegalFields'
import { SmartLink } from '../../components/SmartLink'
import { company } from '../../data/company'

/** /mentions-legales : structure complète, informations inconnues signalées « À compléter ». */
export function LegalNoticePage() {
  return (
    <LegalDocument page="mentions-legales" title="Mentions légales">
      <section aria-labelledby="ml-editeur">
        <h2 id="ml-editeur">Éditeur du site</h2>
        <LegalFields
          fields={[
            { label: 'Raison sociale', value: null },
            { label: 'Forme juridique et capital', value: null },
            { label: 'Adresse du siège', value: null },
            { label: 'SIRET / RCS', value: null },
            { label: 'N° de TVA intracommunautaire', value: null },
            { label: 'Téléphone', value: company.phone.value.display },
            { label: 'E-mail', value: null },
          ]}
        />
      </section>
      <section aria-labelledby="ml-publication">
        <h2 id="ml-publication">Directeur de la publication</h2>
        <LegalFields fields={[{ label: 'Nom', value: null }]} />
      </section>
      <section aria-labelledby="ml-hebergement">
        <h2 id="ml-hebergement">Hébergement</h2>
        <LegalFields
          fields={[
            { label: 'Hébergeur', value: null },
            { label: 'Adresse', value: null },
            { label: 'Téléphone', value: null },
          ]}
        />
      </section>
      <section aria-labelledby="ml-propriete">
        <h2 id="ml-propriete">Propriété intellectuelle</h2>
        <p>
          Les textes, illustrations et éléments graphiques de ce site sont protégés par le droit d’auteur. Toute reproduction ou
          représentation, totale ou partielle, sans autorisation préalable est interdite.
        </p>
      </section>
      <section aria-labelledby="ml-donnees">
        <h2 id="ml-donnees">Données personnelles</h2>
        <p>
          Le traitement des informations transmises par le formulaire de devis est décrit dans la{' '}
          <SmartLink href="/confidentialite" className="font-semibold text-bleu underline">
            politique de confidentialité
          </SmartLink>
          .
        </p>
      </section>
    </LegalDocument>
  )
}
