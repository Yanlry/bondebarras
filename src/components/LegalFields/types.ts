/** Une information légale : valeur connue, ou `null` si elle reste à fournir. */
export interface LegalField {
  label: string
  value: string | null
}

/** Props de {@link LegalFields}. */
export interface LegalFieldsProps {
  fields: readonly LegalField[]
}
