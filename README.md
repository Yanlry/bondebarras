# Bon Débarras — site vitrine immersif

Site vitrine multipage de **Bon Débarras** (débarras, désencombrement, évacuation d'encombrants pour
particuliers et professionnels). L'accueil est raconté au scroll sous le concept **« Faire de la
place »** : une pièce encombrée se vide sous les yeux du visiteur. Les pages secondaires sont
éditoriales, informatives et pré-rendues en HTML complet pour le référencement.

> **État : étape 4 — scène 2 « Vous vous reconnaissez ? ».** Socle multipage (étape 3) en place :
> routes et pré-rendu HTML, navigation, pied de page, téléphone officiel, métadonnées, sitemap,
> robots, 404. L'accueil compte désormais les scènes 0 à 3 ; ses sections provisoires (prestations,
> devis) restent jusqu'à leur remplacement par les scènes 4 à 8. Les pages secondaires sont en
> **version du socle** (illustrations et contenus détaillés aux étapes 8 à 10).
>
> **Le site n'est pas prêt à publier** : il est en mode `preview` (aucune page indexable), les
> informations légales sont incomplètes et le formulaire n'a pas de système d'envoi.

## Démarrer

Node **22.22 ou plus** est requis par React Router 8 (`.nvmrc` : 22.23.3 → `nvm use`).

```bash
npm install            # .npmrc active legacy-peer-deps (contourne un bug de npm 10)
npm run dev            # serveur de développement React Router
npm run build          # TypeScript + build + pré-rendu des 15 pages + contrôle du HTML (échoue si un problème est détecté)
npm run preview        # sert dist/client comme un hébergeur statique (URL propres, vraie 404) sur http://localhost:4173
npm run check:html     # contrôle seul du HTML pré-rendu
npm run lint           # oxlint (src et tests)
npm run test:e2e       # Playwright sur le build de production (lancer npm run build avant)
npm run measure:fps    # mesure réelle des FPS sur le build de production
npm run capture:room   # régénère les images de secours de la pièce depuis la 3D
```

Stack : React 19 · TypeScript strict · Vite 8 · React Router 8 (mode framework, pré-rendu) ·
Tailwind CSS 4 · GSAP 3 (ScrollTrigger, @gsap/react) · Framer Motion (accueil seulement) ·
React Three Fiber (three.js, accueil seulement). Polices auto-hébergées via Fontsource.

## Plan du site

| Route | Page | État |
|---|---|---|
| `/` | Accueil : scrollytelling (scènes 0 à 3) + prestations et devis provisoires | Scène 4 (plan d'architecte) à l'étape 5, puis 5 à 8 |
| `/prestations` | Toutes les prestations (7 cartes, services complémentaires) | Socle |
| `/prestations/debarras-particuliers` | Débarras de maison et d'appartement | Socle |
| `/prestations/debarras-succession` | Après décès, succession, EHPAD, logements très encombrés (ton sobre) | Socle |
| `/prestations/debarras-professionnels` | Bureaux, commerces, entrepôts, ateliers | Socle |
| `/prestations/debarras-exterieur` | Terrains, jardins ; déchets verts, gravats, dépôts sauvages « Sur étude » | Socle |
| `/prestations/tri-recyclage` | Tri, réemploi, recyclage, débarras gratuit sous condition | Socle |
| `/prestations/debarras-cave-grenier-garage` | Caves, greniers, garages, dépendances | Socle |
| `/prestations/syndrome-de-diogene` | Logements très encombrés, sans jugement (ton sobre) | Socle |
| `/entreprise` | Ce que nous faisons, méthode, engagements ; « Qui sommes-nous » à compléter | Socle |
| `/devis` | Formulaire actuel (présélection `?type=`) + téléphone ; envoi non activé, signalé | Socle (3 étapes à l'étape 9) |
| `/contact` | Téléphone en grand, coordonnées provisoires, accès au devis | Socle |
| `/mentions-legales`, `/confidentialite` | Structure complète, champs inconnus « À compléter » | Projet à valider |
| `/404` (et `404.html`) | « Cette page a déjà été débarrassée » | Socle |
| `/sitemap.xml`, `/robots.txt` | Générés au build depuis `data/pages.ts` | — |

## Architecture

```
react-router.config.ts  Mode framework, ssr: false, liste des pages à pré-rendre (depuis data/pages.ts)
src/
├─ root.tsx             Document HTML (Layout), coque commune : écran de chargement (accueil seulement),
│                       liens d'évitement, en-tête, page, pied de page, barre mobile, transition, annonce
├─ entry.client.tsx     Hydratation ; signale en console tout écart HTML pré-rendu / premier rendu
├─ routes.ts            Déclaration des routes (les 7 prestations partagent routes/service-page.tsx)
├─ routes/              Modules de route : `meta` (SEO) + composant ; sitemap.ts, robots.ts (ressources pré-rendues)
├─ pages/               Corps des pages secondaires (un dossier par page : index.tsx + types.ts)
├─ sections/            Sections de l'accueil : RoomStory (scènes 1 et 3), Services et Quote (provisoires), Footer
├─ components/          Un dossier par composant (index.tsx + types.ts) : Header (+ PrestationsMenu,
│                       MobileMenu), SmartLink, PageTransition, PageIntro, Breadcrumb, PlanDecor, CtaBand,
│                       ServicePageCard, ProvisionalNotice, LegalDocument, LegalFields, Preloader,
│                       BrandTitle, Logo, ActionLink, Icon, Provisional, Cursor, SkipLinks, ErrorBoundary…
├─ three/               3D de l'accueil (RoomShell, RoomFurniture, CameraRig, SunBeam, DustMotes, Footprints…)
├─ hooks/               Un hook par scène (useRoomScene, usePreloader, useTitleArrangement, useCursor) ;
│                       usePageChange (changement de page), useHydrated, useScrollScene, utilitaires
├─ data/                Contenus : site (statut, domaine), pages (titres, descriptions, fil d'Ariane),
│                       company (coordonnées), services (familles + 7 pages), quote, navigation,
│                       planLayouts, room, room-story
├─ types/               Types partagés : site, company, service, quote, room, geometry, navigation
├─ lib/                 gsap, seo (meta, données structurées), pageTransition, links, intro, roomMotion, math…
└─ dev/RoomCapture/     Développement uniquement (/__capture) : la pièce seule, pour les images de secours
scripts/                serve.mjs, postbuild.mjs, check-html.mjs, measure-fps.mjs, capture-room.mjs
tests/                  etape-1.spec.ts (non-régression de l'accueil), etape-3.spec.ts (socle multipage)
docs/screenshots/       etape-1/ (prototype), etape-3/accueil/ et etape-3/pages/
```

## Navigation

- **En-tête** (toutes les pages) : logo · Accueil · **Prestations** (menu) · Notre entreprise · Contact ·
  06 62 83 26 57 · **Devis gratuit**. Fond translucide dès que la page défile.
- **Menu Prestations** (desktop) : motif « disclosure » (bouton `aria-expanded`), ouverture au clic,
  au clavier et au survol (avec délai), fermeture par Échap (focus rendu au bouton), clic extérieur,
  sortie du focus ou changement de page. Les 7 prestations + « Toutes nos prestations » + devis.
- **Menu mobile** : dialogue modal plein écran qui descend comme la porte de garage ; focus piégé,
  Échap, défilement bloqué, prestations en accordéon, « Appeler » et « Devis gratuit » en bas.
- **Liens** (`SmartLink`) : chemins internes via React Router (préchargement au survol,
  `aria-current="page"`, transition « scotch »), `tel:` et ancres en liens natifs.
- **Changement de page** : bande de scotch kraft et orange (≈ 0,22 s + 0,26 s, transform seul, aucune
  avec mouvement réduit), retour en haut, focus sur le H1, annonce du titre (`aria-live`).
- **Barre mobile** « Appeler / Devis gratuit » sur toutes les pages, masquée sur le formulaire et le pied de page.
- **Devis présélectionné** : « Devis gratuit » d'une prestation ouvre `/devis?type=<type>` (lu après
  l'hydratation, pour ne jamais diverger du HTML pré-rendu).

## Pré-rendu et référencement

- **React Router 8 en mode framework**, `ssr: false` + `prerender` : chaque route produit son
  `index.html` complet au build (`dist/client/<route>/index.html`), repris ensuite par le navigateur.
  Hébergement statique suffisant.
- **Contenu sans JavaScript** : vérifié automatiquement (Playwright, JavaScript désactivé) sur les
  14 pages. Le script inline du `<head>` ajoute la classe `js` : sans elle, aucune animation ne masque
  de contenu, l'écran de chargement n'est pas affiché et la scène 3D cède la place à l'image de la pièce.
- **`data/pages.ts`** est la source unique des titres (≤ 60 caractères), descriptions (≤ 155), libellés
  et fil d'Ariane ; `lib/seo.ts` produit pour chaque page : title, description, robots, canonical
  absolue, Open Graph, données structurées (`Organization` avec le seul téléphone confirmé ; `Service`
  sur chaque prestation ; `BreadcrumbList` seulement une fois le domaine confirmé).
- **Statut de publication** (`data/site.ts`) : `preview` → toutes les pages `noindex, nofollow`,
  robots.txt `Disallow: /`, sitemap vide. En `live`, seules les pages `ready` sont indexables et listées.
- **Contrôle du HTML au build** (`scripts/check-html.mjs`) : un H1 par page, titres et descriptions
  uniques et à la bonne longueur, robots, canonical, contenu réel dans `<main>`, aucun lien interne
  cassé, numéro officiel partout. Le build échoue sinon.
- **Hébergement** : servir `404.html` avec le code 404 et les URL propres sans barre finale
  (`/contact` → `contact/index.html`), comme `scripts/serve.mjs`. `vite preview` ne le fait pas
  (il renvoie l'accueil pour `/contact`, ce qui fausse l'hydratation) : ne pas l'utiliser pour tester.

## Identité visuelle

Palette « Bleu de travail » (tokens Tailwind dans `src/index.css`) :

| Token | Hex | Rôle |
|---|---|---|
| `air` / `air-deep` | `#F6F3EC` / `#ECE6DA` | Fond blanc cassé chaud / cartes, champs |
| `ink` / `ink-soft` | `#142033` / `#45506A` | Texte (15:1) / texte secondaire (7,3:1 sur `air`) |
| `bleu` / `bleu-deep` / `bleu-soft` | `#2346A0` / `#1A347A` / `#DDE4F3` | Couleur de marque (8,5:1 avec le blanc) |
| `kraft` / `kraft-light` | `#C9A27C` / `#E7D6C1` | Cartons, étiquettes |
| `sangle` / `sangle-deep` | `#E4572E` / `#B93D17` | Accent décoratif / boutons principaux (5,6:1 avec le blanc) |
| `trace` | `#D9D3C7` | Empreintes en pointillés, filets |

Contrastes calculés à partir des valeurs hexadécimales (formule WCAG).

- **Typographies** : Bricolage Grotesque (titres), Instrument Sans (texte), IBM Plex Mono (étiquettes).
- **Signature typographique** « le titre qui se range » (`useTitleArrangement`) : les lettres de
  « Bon Débarras » arrivent en vrac, entassées au bout du mot, puis sont portées une à une à leur
  place ; l'accent du « é » est une **flèche de sortie ↗** qui arrive en dernier (aussi dans le logo).
- **Motifs** : l'empreinte en pointillés (objet enlevé), l'étiquette kraft en police mono, la sangle orange.
- **Logo provisoire** : mot-symbole avec l'accent-flèche (à remplacer par le logo définitif).

## Scènes et animations

| Scène | Statut | Ce que voit le visiteur | Technique |
|---|---|---|---|
| 0 · Chargement « Le carton scellé » | ✅ | Porte de garage à lames, carton scotché au rythme du **vrai** chargement, tampon, porte qui se lève. **Seulement si la visite commence par l'accueil** (il attend la 3D) | Pré-rendu dans le HTML de `/` ; calques HTML sur un SVG fixe ; site `inert` ; durée min 1,5 s, max 5 s |
| 1 · Hero « La pièce pleine » | ✅ | Maquette 3D de pièce en coupe, objets qui tombent, caméra qui suit la souris ; pastilles « Votre situation » → pages de prestation | R3F, un maillage fusionné par objet |
| 2 · « Vous vous reconnaissez ? » | ✅ | **Après le débarras**, dans la pièce vide : pour chaque situation, ses meubles repassent la porte et **reviennent à leur place** (armoire, cartons, fauteuil, sacs, réfrigérateur, plante), puis une étiquette kraft à bagage s'y accroche par une ficelle ; les objets ressortent avant la lumière ; chacune mène à sa prestation. Sur desktop elles s'accumulent, sur mobile elles se relaient une à une ; la légende numérotée s'allume ligne à ligne ; tenue pour lire et cliquer, puis elles sont décrochées | Points d'accroche 3D projetés à l'écran à chaque frame (`SituationAnchors`, `translate3d` seul, écrit seulement s'il bouge) ; étiquettes animées par la même timeline ; légende = vrais liens (clavier, lecteurs d'écran, HTML pré-rendu) ; mode statique : section « Vous vous reconnaissez ? » avec les six liens |
| 3 · « Place nette » | ✅ | Les objets sortent par la porte, empreintes, lumière, carton témoin ; « Je fais de la place » → `/devis`, « Nos prestations » → `/prestations` | Pendant que la pièce se vide, les trois prestations principales se relaient : « Pour votre maison. », « Pour vos proches. », « Pour votre entreprise. », avec un lien « Découvrir » ; timeline GSAP scrubbée (`useRoomScene`) ; poses calculées (`lib/roomMotion`) |
| 4 · Le plan d'architecte | ⏳ étape 5 | Le carton témoin se pose sur un grand plan ; recadrage zone par zone (01 Maison · 02 Succession · 03 Pro · 04 Extérieur) avec fiche en grand (« Découvrir », « Devis » présélectionné), onglets 01-04, bandeau des 3 prestations spécialisées | Section provisoire en attendant |
| 5 · Le tri · 6 · Le trajet | ⏳ étape 6 | Valorisation, méthode | — |
| 7 · Engagements · 8 · La porte | ⏳ étape 7 | Confiance, accès au devis `/devis?type=…` | Section devis provisoire en attendant |
| Pages secondaires | Socle | Introduction éditoriale avec plan d'architecte décoratif (empreintes, carton témoin), contenus, prestations associées, bandeau devis | Statique ; illustrations narratives aux étapes 8 à 10 |
| Transition entre pages | ✅ | Bande de scotch kraft et orange | Web Animations API, transform seul |

Détails communs :
- **Section de l'accueil** épinglée sur ~7,2 hauteurs d'écran, timeline de ≈ 17,7 unités
  (`useRoomScene`) : cadrage 0 → 1,5 · débarras + 3 prestations 1,5 → 8,7 · « Vous vous
  reconnaissez ? » avec retour des meubles (`progress.recall`, même trajet à l'envers) 8,95 → 14,4 ·
  lumière 14,9 → 16,5 · « Bon débarras. » 16,25 → 17,7.
- **Épinglage** en CSS sticky ; variante `scene:` = même media query que GSAP, **et** section marquée
  `data-scene`, **et** JavaScript actif (`.js`).
- **Mode statique = état par défaut du DOM** (mouvement réduit, écran < 560 px de haut, 3D indisponible,
  pas de JavaScript) : pas d'épinglage, hero lisible puis texte final avec l'image de la pièce vide.
- Uniquement `transform` / `opacity` côté DOM ; aucune animation à l'intérieur d'un SVG.
- `ScrollTrigger.clearScrollMemory('manual')` + retour en haut au chargement (navigateur seulement) ;
  `overflow-x: clip`.

## Performances (mesurées)

Build de production servi par `scripts/serve.mjs`, Chromium (Playwright) sur le **GPU réel**
(ANGLE Metal, Apple M1), `npm run measure:fps`, **3 passages** (étape 4, scène 2 incluse) :

| Scénario | Desktop 1440 × 900 | Mobile simulé 390 × 844, DPR 2, CPU ×4 |
|---|---|---|
| Accueil, hero (3 s, souris en mouvement sur desktop) | 59 fps : 1 frame de 66 ms à chaque passage (premier survol d'un bouton, voir ci-dessous) | 60 fps, 0 frame > 20 ms (3/3) |
| Accueil, traversée des scènes 1 → 2 → 3 (8 s) | 60 fps, 0 frame > 20 ms (3/3) | 60 fps, 0 frame > 20 ms (3/3) |
| Transition entre pages (bande « scotch ») | 60 fps, 0 frame > 20 ms (3/3) | 60 fps, 0 frame > 20 ms (3/3) |
| Page de prestation (défilement 4 s) | 60 fps sur 2 passages ; 1 passage à 59,8 fps (1 frame de 33 ms) | 60 fps sur 2 passages ; 1 passage à 59,8 fps (1 frame de 33 ms) |

Aucune autre frame longue (Long Animation Frame > 50 ms) dans aucun passage.

- **Premier survol d'un bouton** (70 à 90 ms, une seule fois par page) : mesuré sur **toutes** les
  pages, y compris sans 3D (`/contact`, `/prestations`), et en partie reproduit sur une page vide (un
  simple bouton : 63 ms au premier survol du navigateur). Il disparaît si aucune transition ne démarre
  au survol. Ce n'est pas la scène 2 : à l'étape 3, la mesure ne survolait jamais le bouton du hero, que
  recouvrait par erreur le calque invisible de « Bon débarras. » (bug corrigé à l'étape 4). À vérifier
  dans un vrai navigateur (Chrome avec DevTools) lors de l'audit de l'étape 11.

- **Simulation mobile ≠ appareil réel** : l'émulation ralentit le processeur (×4) mais **pas le GPU**.
  Aucune mesure n'a encore été faite sur un vrai téléphone (prévu : compteur `?mesure` ou Android en USB).
- **Artefact du navigateur** : dans Chromium piloté par Playwright, le premier défilement après un
  mouvement de souris produit une frame de 70 à 120 ms, reproduite à l'identique sur une page vide.
  Le script de mesure donne un cran de molette avant la traversée.
- **JavaScript chargé** (gzip) : accueil 220 kB + 3D à la demande 242 kB ; pages secondaires
  170 à 174 kB, **sans three.js ni Framer Motion** (Framer confiné à l'accueil à cette étape : −42 kB
  par page secondaire). CSS 11,4 kB.
- Écran de chargement (mesuré à l'étape 1) : copie visible à 0,3 s ; porte levée à 2,6 s (desktop,
  local) et 3,2 s (mobile 4G simulée + CPU ×4).

## Accessibilité

- `prefers-reduced-motion` : aucun épinglage ni scrub, objets directement en place, pas de fondus,
  caméra fixe, pas de transition entre pages, menus sans glissement, `MotionConfig reducedMotion="user"`.
- Liens d'évitement « Aller au contenu » et « Demander un devis » (sur `/devis` : « Aller au formulaire »), testés au clavier.
- Navigation : menus utilisables au clavier (Échap, focus rendu, focus piégé dans le menu mobile),
  `aria-current="page"`, fil d'Ariane, focus sur le H1 et annonce du titre à chaque changement de page.
- La 3D est décorative (`aria-hidden`) : la scène est décrite en `sr-only` ; le titre signature est
  lu une seule fois (« Bon Débarras ») ; les informations provisoires sont annoncées comme telles.
- Écran de chargement : `role="status"`, site `inert` derrière (testé), défilement bloqué.
- Contrastes AA (voir palette) ; focus visible partout ; curseur personnalisé uniquement à la souris,
  curseur natif conservé dans les champs.
- Formulaire : libellés, champs obligatoires, règle « téléphone ou e-mail » annoncée, message d'état.

## Décisions techniques

- **Node 22** : React Router 8 l'exige ; la version installée par nvm (22.23.3) est fixée dans `.nvmrc`.
- **Serveur statique maison pour les tests** (`scripts/serve.mjs`) : `vite preview` sert l'accueil pour
  toute URL inconnue, ce qui provoquait de fausses erreurs d'hydratation sur les pages secondaires.
- **Chemins normalisés** (`lib/links.ts`) : le pré-rendu peut fournir `/devis/` pour `/devis` ; toute
  comparaison de chemin passe par `normalizePath` (un écart avait cassé l'hydratation de `/devis`).
- **Lecture de l'URL après l'hydratation** (`useHydrated`) : la présélection `?type=` ne change jamais
  le premier rendu ; elle s'applique aussi après une navigation interne.
- **Menu mobile hors de l'en-tête** : le `transform` et le `backdrop-filter` de l'en-tête limiteraient
  sinon son `position: fixed` à la hauteur de l'en-tête.
- **Framer Motion confiné à l'accueil** : l'entrée de l'en-tête est une transition CSS.
- **Étiquettes de la scène 2 en calques HTML** (et non en 3D) : texte net, liens cliquables, aucune
  texture à générer ; seul leur point d'accroche vient de la 3D. Étiquettes courtes sur l'image,
  phrases complètes dans la légende ; côté et longueur de ficelle réglés par étiquette (desktop et
  mobile) pour qu'elles ne se chevauchent jamais et ne sortent pas de l'écran.
- **Grille du hero transparente aux clics** en mode animé (seul son texte les reçoit) : elle couvrait
  sinon les étiquettes de la scène 2 et bloquait leurs clics (détecté par les tests).
- **Une seule scène 3D pour les scènes 1 à 3** (même canvas épinglé) : la pièce du hero est
  celle qui se vide ; le recadrage passe par `camera.setViewOffset`, la mise en page reste en CSS.
- **Poses calculées, jamais accumulées** : chaque objet a une fenêtre de départ dans `clear`
  (ordre logique : ce qui est près de la porte et empilé d'abord), un trajet en courbe de Bézier
  vers la porte, une orientation pour passer l'ouverture. Même progression ⇒ même image (écart
  aller / retour mesuré : 0,1 % des pixels sur desktop, dû à la poussière ; ~3 % sur mobile, dû à la
  « respiration » volontaire de la caméra).
- **Images de secours générées depuis la 3D** (`npm run capture:room`) : sans WebGL ou si la 3D
  plante (`ErrorBoundary`), la section passe en mode statique avec ces images.
- **Pas d'état « soulever » sur le curseur** au-dessus des objets 3D : tout changement d'aspect
  du curseur au-dessus de la pièce coûtait une frame de 60 à 90 ms au premier survol (mesuré,
  attribué à du travail natif du navigateur). L'objet qui se soulève suffit comme retour visuel.
- **GSAP et `translate`** : GSAP réécrit `translate` sur les éléments qu'il anime ; ils sont
  positionnés sans les classes `translate-*` de Tailwind. Pas de `stagger` dans les `fromTo`
  scrubbés (un tween par élément, pour que chaque état de départ soit posé dès la construction).
- **Formulaire honnête** : aucun service d'envoi branché (`QUOTE_ENDPOINT = null`) ; à l'envoi,
  le site le dit et propose d'appeler — jamais de faux message de succès.
- **Prestations non confirmées** (déchets verts, gravats, dépôts sauvages) affichées « Sur étude »,
  jamais comme garanties ; débarras gratuit présenté avec sa condition.

## Tests

Sur le build de production (`scripts/serve.mjs`), en 1440 × 900, 1280 × 720, 390 × 844 et 375 × 667 :
**98 tests réussis, 10 ignorés** (tests propres au desktop ou au mobile, ou faits sur une seule taille).

- `tests/etape-3.spec.ts` — chaque page (statut 200, H1, titre, `noindex`, téléphone officiel, aucun
  débordement horizontal, **aucune erreur console ni écart d'hydratation**, captures écran et page
  complète) ; contenu **sans JavaScript** sur les 14 pages ; menu Prestations (survol, clavier, Échap,
  navigation, focus sur le H1) ; menu mobile (focus piégé, Échap, accordéon, navigation) ; devis
  présélectionné (`?type=` connu / inconnu, après navigation interne) ; formulaire sans faux succès ;
  vraie 404 ; liens d'évitement ; barre mobile ; robots et sitemap en mode préparation.
- `tests/etape-4.spec.ts` — scène 2 : légende et étiquettes masquées avant la scène, six étiquettes
  visibles sur desktop (une seule à la fois sur mobile), toutes dans l'écran et **sans chevauchement**
  (vérifié par leurs rectangles), liens de la légende dans l'ordre, clic sur une étiquette → page de la
  prestation, retour et rejeu, relais sur mobile, section statique en mouvement réduit, boutons du hero
  toujours cliquables.
- `tests/etape-1.spec.ts` — non-régression de l'accueil : chargement (site inerte puis libéré), hero,
  scène à 8 / 20 / 34 / 55 / 80 / 100 %, scroll arrière (écart aller / retour ≈ 0,1 % des pixels sur
  desktop, ~3 % sur mobile, dû à la respiration volontaire de la caméra), mouvement réduit (aucun
  épinglage), clavier.
- `scripts/check-html.mjs` — contrôle du HTML pré-rendu à chaque build (voir Pré-rendu).

Captures : `docs/screenshots/etape-3/` (accueil, pages) et `docs/screenshots/etape-4/` (accueil, scène 2).

## À compléter avant la mise en ligne

Le site ne sera prêt à publier qu'après validation de ses contenus, de ses liens et de ses
fonctionnalités. Valeurs provisoires dans `src/data/` (marquées `TODO`), affichées comme telles :

- [x] **Téléphone** officiel : 06 62 83 26 57 (`tel:+33662832657`), partout.
- [ ] **Domaine** (`data/site.ts`) : l'actuel `www.bon-debarras.example` est un placeholder (canonicals, Open Graph, sitemap).
- [ ] **Statut de publication** : passer `site.status` à `live` et chaque page validée à `ready` (`data/pages.ts`).
- [ ] **E-mail, adresse, horaires, zones d'intervention** (`data/company.ts`).
- [ ] **Mentions légales** : raison sociale, forme juridique, capital, siège, SIRET / RCS, TVA, e-mail,
      directeur de la publication, hébergeur.
- [ ] **Politique de confidentialité** : responsable du traitement, contact, prestataire d'envoi, durée
      de conservation ; base légale à valider.
- [ ] **Système d'envoi du formulaire** (`QUOTE_ENDPOINT`) avec protections (anti-robots, validation
      serveur, limitation) — étape 9.
- [ ] **« Qui sommes-nous »** (`/entreprise`) : histoire, équipe, photos, statut, assurances.
- [ ] **Validation opérationnelle** des prestations « Sur étude » (`data/services.ts`).
- [ ] **Logo définitif** ; **photos** réelles ; **tarifs** (aucun affiché) ; **avis** (aucun affiché).
- [ ] Image de partage Open Graph par page (étape 11) ; `LocalBusiness` complet quand l'adresse sera connue.
- [ ] Hébergement : `404.html` avec code 404, URL propres sans barre finale.
- [ ] Mesure des FPS sur de vrais téléphones.
