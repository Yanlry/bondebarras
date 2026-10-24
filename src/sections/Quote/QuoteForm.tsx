import { useId, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import { SmartLink } from '../../components/SmartLink'
import { company } from '../../data/company'
import { parseQuoteType, QUOTE_ENDPOINT, quoteTypes } from '../../data/quote'
import { useHydrated } from '../../hooks/useHydrated'
import { cn } from '../../lib/cn'
import type { QuoteTypeId } from '../../types/quote'
import type { QuoteFormValues, QuoteStatus } from './types'

const INITIAL: QuoteFormValues = {
  profile: 'particulier',
  name: '',
  phone: '',
  email: '',
  type: '',
  postalCode: '',
  city: '',
  description: '',
  date: '',
  consent: false,
}

const fieldClass =
  'mt-1.5 block w-full rounded-xl border-2 border-trace bg-white px-4 py-3 text-base text-ink placeholder:text-ink-soft/70 transition-colors focus:border-bleu focus:outline-none'
const labelClass = 'block text-sm font-semibold text-ink'

/**
 * Formulaire de devis : coordonnées, type de débarras, localisation et
 * description du besoin. Validation native, plus une règle : téléphone OU e-mail.
 *
 * TODO : aucun service d'envoi n'est encore branché (`QUOTE_ENDPOINT`). Le
 * formulaire le dit honnêtement à l'envoi et propose d'appeler : jamais de
 * faux message de succès.
 */
export function QuoteForm() {
  const id = useId()
  const [values, setValues] = useState<QuoteFormValues>(INITIAL)
  const [status, setStatus] = useState<QuoteStatus>('idle')
  const statusRef = useRef<HTMLParagraphElement>(null)
  const [searchParams] = useSearchParams()
  const hydrated = useHydrated()
  // `?type=…` (lien « Devis » d'une prestation) : lu seulement après l'hydratation,
  // pour que le premier rendu soit identique au HTML pré-rendu.
  const draftType = hydrated ? parseQuoteType(searchParams.get('type')) : null

  // Type présélectionné : ajusté pendant le rendu, dès que la présélection change
  // (aussi au premier rendu après une navigation interne, d'où la valeur initiale `null`).
  const [appliedDraft, setAppliedDraft] = useState<QuoteTypeId | null>(null)
  if (draftType !== appliedDraft) {
    setAppliedDraft(draftType)
    if (draftType) setValues((current) => ({ ...current, type: draftType }))
  }

  const set = <K extends keyof QuoteFormValues>(key: K, value: QuoteFormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }))

  const missingContact = status === 'invalid' && !values.phone.trim() && !values.email.trim()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!values.phone.trim() && !values.email.trim()) {
      setStatus('invalid')
      document.getElementById(`${id}-phone`)?.focus()
      return
    }
    // TODO : envoyer `values` à QUOTE_ENDPOINT une fois le service choisi.
    if (!QUOTE_ENDPOINT) {
      setStatus('unavailable')
      requestAnimationFrame(() => statusRef.current?.focus())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" aria-describedby={`${id}-note`} data-hide-action-bar>
      <fieldset>
        <legend className={labelClass}>Vous êtes</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['particulier', 'professionnel'] as const).map((profile) => (
            <label key={profile} className="cursor-pointer">
              <input
                type="radio"
                name="profile"
                value={profile}
                checked={values.profile === profile}
                onChange={() => set('profile', profile)}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border-2 border-trace px-4 py-2 text-sm font-medium text-ink transition-colors peer-checked:border-bleu peer-checked:bg-bleu peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sangle-deep">
                {profile === 'particulier' ? 'Un particulier' : 'Un professionnel'}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label htmlFor={`${id}-name`} className={labelClass}>
            Nom <span aria-hidden="true">*</span>
          </label>
          <input id={`${id}-name`} name="name" required autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className={labelClass}>
            Téléphone
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            aria-invalid={missingContact || undefined}
            aria-describedby={`${id}-contact-hint`}
            className={cn(fieldClass, missingContact && 'border-sangle-deep')}
          />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={labelClass}>
            E-mail
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={missingContact || undefined}
            aria-describedby={`${id}-contact-hint`}
            className={cn(fieldClass, missingContact && 'border-sangle-deep')}
          />
        </div>
        <p id={`${id}-contact-hint`} className={cn('-mt-3 text-sm sm:col-span-3', missingContact ? 'font-semibold text-sangle-deep' : 'text-ink-soft')}>
          Indiquez au moins un téléphone ou un e-mail pour que nous puissions vous répondre.
        </p>
      </div>

      <fieldset>
        <legend className={labelClass}>
          Type de débarras <span aria-hidden="true">*</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {quoteTypes.map((option) => (
            <label key={option.id} className="cursor-pointer">
              <input
                type="radio"
                name="type"
                required
                value={option.id}
                checked={values.type === option.id}
                onChange={() => set('type', option.id)}
                className="peer sr-only"
              />
              <span className="footprint inline-block rounded-full px-3.5 py-2 text-sm text-ink transition-colors peer-checked:border-solid peer-checked:border-bleu peer-checked:bg-bleu-soft peer-checked:font-semibold peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sangle-deep">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
        <div>
          <label htmlFor={`${id}-cp`} className={labelClass}>
            Code postal <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-cp`}
            name="postalCode"
            required
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="[0-9]{5}"
            title="5 chiffres"
            value={values.postalCode}
            onChange={(e) => set('postalCode', e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={`${id}-city`} className={labelClass}>
            Ville <span aria-hidden="true">*</span>
          </label>
          <input id={`${id}-city`} name="city" required autoComplete="address-level2" value={values.city} onChange={(e) => set('city', e.target.value)} className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-description`} className={labelClass}>
          Votre besoin <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${id}-description`}
          name="description"
          required
          rows={5}
          placeholder="Ex. : maison de 4 pièces à vider avant la vente, cave et garage compris, 2e étage sans ascenseur…"
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor={`${id}-date`} className={labelClass}>
          Date souhaitée <span className="font-normal text-ink-soft">(facultatif)</span>
        </label>
        <input id={`${id}-date`} name="date" placeholder="Ex. : dès que possible, avant fin juin…" value={values.date} onChange={(e) => set('date', e.target.value)} className={fieldClass} />
      </div>

      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="consent"
          required
          checked={values.consent}
          onChange={(e) => set('consent', e.target.checked)}
          className="mt-0.5 size-5 flex-none accent-bleu"
        />
        <span>
          J’accepte que ces informations soient utilisées pour me recontacter au sujet de ma demande de devis.{' '}
          <SmartLink href="/confidentialite" className="font-semibold text-bleu underline">
            Politique de confidentialité
          </SmartLink>{' '}
          (en cours de rédaction).
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="action inline-flex items-center gap-3 rounded-full bg-sangle-deep px-7 py-4 font-display text-lg font-semibold text-white shadow-[0_10px_24px_-12px_rgb(185_61_23/0.7)] hover:bg-[#a03413]"
        >
          Envoyer ma demande de devis
        </button>
        <p id={`${id}-note`} className="text-sm text-ink-soft">
          * Champs obligatoires. Devis gratuit et sans engagement.
        </p>
      </div>

      <p ref={statusRef} tabIndex={-1} role="status" className={cn('rounded-xl bg-kraft-light px-5 py-4 text-ink', status !== 'unavailable' && 'sr-only')}>
        {status === 'unavailable' && (
          <>
            L’envoi en ligne n’est pas encore activé sur ce site. Pour votre demande, appelez-nous au{' '}
            <a href={company.phone.value.href} className="font-semibold underline">
              {company.phone.value.display}
            </a>
            .
          </>
        )}
      </p>
    </form>
  )
}
