import type { LegalFieldsProps } from './types'

/** Liste d'informations légales ; celles qui manquent sont signalées « À compléter ». */
export function LegalFields({ fields }: LegalFieldsProps) {
  return (
    <dl className="mt-5 divide-y divide-trace rounded-2xl border border-trace bg-white/60">
      {fields.map((field) => (
        <div key={field.label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-6">
          <dt className="font-semibold text-ink">{field.label}</dt>
          <dd className={field.value ? 'text-ink-soft' : 'provisional w-fit text-ink-soft'}>
            {field.value ?? 'À compléter'}
            {!field.value && <span className="sr-only"> (information manquante)</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}
