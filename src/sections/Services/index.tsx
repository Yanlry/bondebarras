import { complementaryServices, serviceCategories } from '../../data/services'
import { ServiceCard } from './ServiceCard'
import { ServiceLine } from './ServiceLine'

/**
 * Prestations de Bon Débarras, en HTML classique : lisibles et indexables
 * indépendamment de toute animation.
 *
 * Version provisoire de l'accueil : la scène 4 « Le plan d'architecte » la
 * remplacera (même contenu, `data/services.ts`). Chaque famille mène à sa page.
 */
export function Services() {
  return (
    <section id="prestations-accueil" aria-labelledby="prestations-titre" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="tag-kraft">Nos prestations</p>
      <h2 id="prestations-titre" className="mt-4 max-w-[20ch] font-display text-[clamp(2.2rem,6vw,3.8rem)] leading-[0.98] font-extrabold tracking-[-0.04em] text-ink">
        Les espaces que nous libérons
      </h2>
      <p className="mt-4 max-w-[60ch] text-lg text-ink-soft">
        Particuliers ou professionnels, quelques meubles ou un bâtiment entier : trouvez votre situation et demandez votre devis gratuit.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {serviceCategories.map((category) => (
          <ServiceCard key={category.id} category={category} />
        ))}
      </div>

      <div className="mt-14 rounded-2xl bg-bleu px-6 py-8 text-air sm:px-10 sm:py-10">
        <h3 className="font-display text-2xl font-bold tracking-[-0.02em]">Avec chaque intervention</h3>
        <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2 [&_*]:!text-air [&_.text-ink-soft]:!text-air/80 [&_svg]:!text-kraft-light">
          {complementaryServices.map((item) => (
            <ServiceLine key={item.label} item={item} />
          ))}
        </ul>
      </div>
    </section>
  )
}
