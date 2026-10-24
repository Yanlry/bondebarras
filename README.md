# Bon Débarras — site vitrine immersif

Site one-page de **Bon Débarras** (débarras, désencombrement, évacuation d'encombrants pour
particuliers et professionnels), raconté au scroll sous le concept **« Faire de la place »** :
une pièce encombrée se vide sous les yeux du visiteur, et la page elle-même devient de plus en
plus aérée jusqu'au formulaire de devis.

> **État : étape 2 — prototype initial.** Installation, identité graphique, écran de chargement
> et première scène 3D (la pièce pleine → « Place nette »). Les prestations, le devis et le pied
> de page existent en **version provisoire** (HTML statique, sans scène), pour que le devis et le
> téléphone soient accessibles dès maintenant. Les autres scènes viendront étape par étape.

## Démarrer

```bash
npm install            # .npmrc active legacy-peer-deps (contourne un bug de npm 10)
npm run dev            # http://localhost:5173
npm run build          # vérification TypeScript + build de production dans dist/
npm run preview        # sert dist/ sur http://localhost:4173
npm run lint           # oxlint (src et tests)
npm run test:e2e       # Playwright sur le build de production (lancer npm run build avant)
npm run measure:fps    # mesure réelle des FPS sur le build de production
npm run capture:room   # régénère les images de secours de la pièce depuis la 3D
```

Stack : React 19 · TypeScript strict · Vite 8 · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, @gsap/react) ·
Framer Motion · React Three Fiber (three.js). Polices auto-hébergées via Fontsource.

## Architecture

```
src/
├─ App.tsx              Page unique : chargement, liens d'évitement, en-tête, sections, barre mobile
├─ main.tsx             Montage React, polices ; mode capture de la pièce en développement
├─ sections/            Une section = un dossier (index.tsx + types.ts + sous-composants privés)
│  ├─ RoomStory/        Scènes 1 et 3 : hero 3D « La pièce pleine » puis « Place nette »
│  │                    (HeroCopy, ClearProgress, ClearedCopy, RoomScene = canvas chargé à la demande)
│  ├─ Services/         Prestations (provisoire, HTML indexable) : ServiceCard, ServiceLine
│  ├─ Quote/            Devis (provisoire) : QuoteForm
│  └─ Footer/
├─ components/          Un dossier par composant (index.tsx + types.ts) : Preloader, CartonArt,
│                       BrandTitle (+ AccentArrow), Logo, Header, MobileActionBar, ActionLink, Icon,
│                       Provisional, Cursor, SkipLinks, ErrorBoundary
├─ three/               3D (un dossier par composant) : RoomShell, RoomFurniture, CameraRig,
│                       RoomLights, SunBeam, DustMotes, Footprints ; geometry/ (fusion des pièces,
│                       parquet) ; materials/ (shaders des empreintes et du soleil)
├─ hooks/               Un hook par scène : useRoomScene (timeline scrubbée), usePreloader,
│                       useTitleArrangement, useCursor ; socle useScrollScene ; utilitaires
│                       (useMediaQuery, useInViewport, usePointerRef, useRelativeRect…)
├─ data/                Contenus éditables : company (coordonnées, placeholders), services, quote,
│                       navigation, room (la pièce et ses 26 objets), room-story (textes de la scène)
├─ types/               Types partagés : company, service, quote, room, geometry, navigation
├─ lib/                 Fonctions pures et stores : gsap (plugins + media query des scènes),
│                       intro (chargement → hero), roomMotion (trajets des objets), math, webgl,
│                       quoteDraft (type de devis présélectionné), cn
├─ styles/              CSS de l'écran de chargement, du curseur et des boutons
└─ dev/RoomCapture/     Développement uniquement : la pièce seule, pour générer les images de secours
public/images/          piece-avant.webp / piece-apres.webp (générées depuis la 3D)
scripts/                capture-room.mjs, measure-fps.mjs
tests/                  Playwright (etape-1.spec.ts) + helpers
docs/screenshots/       Captures de chaque étape (etape-1/…)
```

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
| 0 · Chargement « Le carton scellé » | ✅ | Porte de garage à lames (bleu), un carton kraft que le scotch referme au rythme du **vrai** chargement (15 % page, 50 % polices, 100 % première image 3D), tampon « BON DÉBARRAS », puis la porte se lève | Copie statique dans `index.html` ; calques HTML sur un SVG fixe (`transform` seul) ; site `inert` et défilement bloqué ; durée min 1,5 s, max 5 s |
| 1 · Hero « La pièce pleine » | ✅ | Maquette 3D d'une pièce en coupe (26 objets, 21 sur mobile) qui tombent un à un à l'arrivée ; la caméra suit la souris, l'objet survolé se soulève ; sur mobile la vue « respire » | R3F, un maillage fusionné par objet, intro calculée en fonction du temps |
| 2 · « Vous vous reconnaissez ? » | ⏳ | Étiquettes de situations accrochées aux objets | À venir (s'insère entre le cadrage et le débarras) |
| 3 · « Place nette » | ✅ | Au scroll (section épinglée ~4,4 écrans) : la pièce glisse au centre, les objets sortent un à un par la porte (meubles portés inclinés « sur un coin », cartons en arc), chacun laisse son **empreinte en pointillés** ; jauge « Pièce libérée », légendes « On trie / On porte / On évacue » ; la lumière revient, la poussière disparaît, il ne reste que le **carton témoin** dans la tache de soleil ; « Bon débarras. » + devis | Timeline GSAP scrubbée (`useRoomScene`) qui écrit `focus / clear / light` ; la 3D en déduit chaque pose (fonctions pures, `lib/roomMotion`) |
| 4 · Le plan d'architecte | ⏳ | Prestations en 4 zones | Contenu déjà présent en HTML (version provisoire) |
| 5 · Le tri · 6 · Le trajet · 7 · Engagements · 8 · La porte | ⏳ | Valorisation, méthode, confiance, devis | À venir |

Détails communs :
- **Épinglage** en CSS sticky (conteneur `scene:h-[440svh]`, enfant `scene:sticky scene:h-svh`),
  variante `scene:` = même media query que GSAP **et** section marquée `data-scene`.
- **Mode statique = état par défaut du DOM** (`prefers-reduced-motion`, écran < 560 px de haut,
  ou 3D indisponible) : pas d'épinglage, hero lisible puis texte final avec l'image de la pièce vide.
  La timeline part de cet état (`fromTo`) : remonter la page rejoue tout à l'envers.
- Uniquement `transform` / `opacity` côté DOM ; aucune animation à l'intérieur d'un SVG.
- `ScrollTrigger.clearScrollMemory('manual')` + retour en haut à chaque chargement ; `overflow-x: clip`.

## Performances (mesurées)

Build de production, Chromium (Playwright) sur le **GPU réel** (ANGLE Metal, Apple M1),
`npm run measure:fps` : 3 s de hero (souris en mouvement sur desktop), puis traversée complète
de la scène en 8 s.

| Profil | Hero | Traversée de la scène |
|---|---|---|
| Desktop 1440 × 900 | 60 fps, 0 frame > 20 ms, 0 frame longue | 60 fps, 0 frame > 20 ms, 0 frame longue |
| Mobile 390 × 844, DPR 2, **CPU ×4** | 60 fps, 0 frame > 20 ms, 0 frame longue | 60 fps sur 4 mesures sur 5 ; 1 mesure à 59,4 fps (5 frames entre 20 et 33 ms, 2 frames longues) |

- Le GPU n'est **pas** ralenti en émulation mobile : les FPS sont à confirmer sur de vrais téléphones.
- **Artefact du navigateur** : dans Chromium piloté par Playwright, le **premier** défilement après
  un mouvement de souris produit une frame de 70 à 120 ms, **reproduite à l'identique sur une page
  vide** (div de 5 000 px, aucun script). Le script de mesure donne un cran de molette avant la traversée.
- Écran de chargement : copie statique visible à 0,3 s ; porte levée à 2,6 s (desktop, réseau
  local) et 3,2 s (mobile 4G simulée + CPU ×4).
- Poids : bundle principal 172 kB gzip ; 3D (three.js + R3F) dans un chunk séparé de 252 kB gzip,
  chargé à la demande ; images de secours 69 kB et 53 kB (WebP).

Ce qui le permet : un maillage fusionné à couleurs de sommets par objet (un seul appel de dessin
chacun) ; un seul matériau ; carte d'ombre recalculée **uniquement quand un objet bouge** ;
empreintes (1 `InstancedMesh` + shader) et poussière (1 `InstancedMesh`) ; résolution plafonnée
(1,5× mobile, 1,75× desktop) ; rendu en pause hors écran ; scène allégée sur mobile.

## Accessibilité

- `prefers-reduced-motion` : aucun épinglage ni scrub, objets directement en place, pas de fondus,
  caméra fixe, `MotionConfig reducedMotion="user"`.
- Liens d'évitement « Aller au contenu » et « Aller au devis » (testés au clavier).
- La 3D est décorative (`aria-hidden`) : la scène est décrite en `sr-only` ; le titre signature est
  lu une seule fois (« Bon Débarras ») ; les informations provisoires sont annoncées comme telles.
- Écran de chargement : `role="status"`, site `inert` derrière (testé), défilement bloqué.
- Contrastes AA (voir palette) ; focus visible partout ; curseur personnalisé uniquement à la souris,
  curseur natif conservé dans les champs.
- Formulaire : libellés, champs obligatoires, règle « téléphone ou e-mail » annoncée, message d'état.

## Référencement

- Les prestations sont du **HTML classique** (titres h2/h3, listes), indépendant des animations ;
  le hero porte un h1 descriptif (« Bon Débarras — Débarras de maisons, appartements, caves et
  locaux professionnels ») ; `title` et `description` renseignés dans `index.html`.
- Le site est rendu côté client (Google exécute le JavaScript) ; un `<noscript>` résume l'activité.
  **Décision à prendre** : pré-rendre la page en HTML statique au build, pour que le contenu soit
  présent dès la réponse du serveur (recommandé avant la mise en ligne).
- Données structurées `LocalBusiness` : à ajouter une fois les vraies coordonnées connues.

## Décisions techniques

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

`tests/etape-1.spec.ts`, sur le build de production, en 1440 × 900, 1280 × 720, 390 × 844 et
375 × 667 (22 tests réussis, 2 ignorés : clavier sur mobile) :
chargement (site inerte puis libéré, retour en haut), hero (h1, devis et téléphone visibles dans le
premier écran, aucun débordement horizontal), scène à 12 / 30 / 55 / 80 / 100 %, scroll arrière
(comparaison de pixels aller / retour), mouvement réduit (pas d'épinglage, fin lisible avec l'image),
liens d'évitement au clavier. Captures : `docs/screenshots/etape-1/<format>-<moment>.png`.

## À compléter avant la mise en ligne

Toutes les valeurs provisoires sont dans `src/data/` (marquées `TODO`) et affichées comme telles
(soulignement en pointillés kraft) :

- [ ] **Téléphone** (`data/company.ts`) — affiché et lien `tel:`.
- [ ] **E-mail, adresse, horaires, zones d'intervention** (`data/company.ts`).
- [ ] **Logo définitif** (remplacer `components/Logo`, l'accent-flèche peut être conservé ou non).
- [ ] **Service d'envoi du formulaire** (`QUOTE_ENDPOINT` dans `data/quote.ts`) et politique de confidentialité.
- [ ] **Validation opérationnelle** des prestations « Sur étude » (`data/services.ts`).
- [ ] **Photos** réelles (interventions, équipe, véhicule) — aucune n'est inventée.
- [ ] **Tarifs** : aucun n'est affiché pour l'instant.
- [ ] **Avis clients** : aucun n'est affiché ; bloc prévu seulement avec de vrais avis.
- [ ] Mentions légales, image de partage Open Graph, données structurées `LocalBusiness`.
- [ ] Décision : pré-rendu statique du HTML au build (référencement).
- [ ] Vérification des FPS sur de vrais téléphones (l'émulation ne ralentit pas le GPU).
