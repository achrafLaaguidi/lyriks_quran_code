# Frontend redesign handoff

## Assessment before implementation

The existing frontend uses React 18, Vite 2, React Router 6, Redux Toolkit 1.8 / RTK Query, Tailwind 3, Ant Design, i18next, React Icons, Swiper, Axios and SweetAlert2. It is JavaScript rather than TypeScript. There was a build script but no lint or test script or testing framework.

Working foundations retained: RTK Query caching and API definitions, Redux playback actions, multilingual content dictionaries, reciter/narration selection, audio downloads, Quran page images, persisted reading position, Hadith collection/chapter navigation and paginated search. No religious content or translation files were edited.

Problems found: inconsistent saturated palettes, nested full-screen scroll containers, inaccessible clickable divs/SVGs, hover-only audio actions, no homepage, page-bound radio audio, missing loading/error feedback, direct-link Hadith crashes through `location.state`, unsafe pagination parsing, and recitation selection that assumed the first returned recording matched the user's choice.

The existing structure was adapted. New components replace the active route UI; old components remain available for reference and were not deleted. API routes and backend contracts remain intact. Quran now lives at `/quran`, while `/` is the requested landing page. Existing `/surah/:id`, `/books`, `/chapters/:bookSlug`, `/hadiths/:bookSlug/:chapter`, `/radio` and `/tafsir` links remain supported.

## Completed interface

- Shared Arabic-first RTL header, content language selector, four service links, search access, mobile menu, skip link, semantic main/footer and visible keyboard focus.
- Homepage with reading/listening actions, four service cards, actual API-sourced featured Surahs and local recent activity.
- Quran browser with actual 114-Surah metadata, number/name search tolerant of Arabic vocalization, reciter/narration controls, accessible listening/download actions and selected playback state.
- Reader with the original Quran page images, collapsible Surah index, page selector, previous/next pages and Surahs, local bookmarks and image magnification. Old `save` storage format is preserved.
- Hadith library with collection/chapter browsing, debounced text search, encoded queries, source-provided grades, full original text, source references, pagination, copy/share and local bookmark toggles. Direct links no longer need navigation state. Recent access is recorded.
- Radio station search, active station styling, and a shared route-persistent player with play/pause, previous/next, volume/mute, loading and connection errors. Live radio has no seek bar or fictional duration. Recorded recitation/Tafsir retains seeking, repeat and shuffle.
- Audio Tafsir separates the source heading from its supplied lessons, with Surah selection, previous/next Surah, download and shared playback.
- Lazy-loaded route modules, reusable error boundary, empty/loading states, reduced-motion handling, mobile layouts and safe optional persistence.
- Correct recording selection by full `moshaf_type` rather than the first item. Legacy/default narration identifier `1` maps to the verified catalog identifier `11` (Hafs, murattal). Unavailable recitations are disabled rather than constructing invalid audio URLs.

## Design system

`src/index.css` centralizes the three principal colors: emerald `#176B5B`, ivory `#F8F6F0`, and muted gold `#C5A46D`. White, charcoal, muted text and neutral borders are supporting readability tokens. Gold is used for borders/decorative accents rather than low-contrast body text.

`--ratio: 1.613` and the requested 4 / 6.5 / 10.5 / 17 / 27 / 44 / 71px spacing scale define the visual rhythm. Hero and Tafsir layouts use 1.613 proportions. Typography uses 13–16px supporting controls, 26px section headings and a 42px page title scale with responsive adjustments. The existing Google Fonts Amiri family is retained with system fallbacks; duplicate font requests were removed. Original Quran page images preserve their original typography and diacritics.

## Reusable additions

- `Header`: shared desktop/mobile navigation.
- `PageHeading`, `SearchInput`, `LoadingState`, `ErrorState`, `ContentBoundary`: common UI and error handling.
- `PersistentPlayer`: one audio element outside the route tree.
- `useStoredState` / `readStored`: optional, resilient local persistence.
- `selectMoshaf`, `recitationUrl`, `normalizeSearch`: tested source adapters and metadata search.
- `Library`: shared collection, chapter and Hadith route composition.

## Validation

- `npm ci` installed the existing lockfile. No application or development dependencies were added or upgraded.
- `npm run build`: passed. Vite reports the pre-existing outdated Browserslist data warning; no build errors.
- `npm test`: passed (`tests/quran.test.mjs`), covering recording selection, unavailable/invalid Surah URLs, padded filenames and Arabic metadata search.
- ESLint on all changed application JS/JSX/MJS, including `react-hooks/exhaustive-deps`: passed.
- Full `npm run lint`: 547 errors and 4 warnings remain, reporting existing violations in untouched legacy components/helpers/pages; those files have not been silently excluded. This remains repository cleanup work.
- Chromium checks passed: 114 Surahs; search by number and vocalized Arabic; reader bookmark; direct Hadith URLs and credential error state; Tafsir selection; invalid Surah handling; same audio DOM element across internal navigation; live-radio seek suppression; mobile menu.
- No document-level horizontal overflow across `/`, `/quran`, `/radio`, `/tafsir`, `/books`, `/surah/1` at 320, 375, 768 and 1440px (24 route/viewport combinations). Magnified Quran images intentionally scroll inside their reader viewport.
- Browser checks used captured real MP3Quran responses, with playback calls simulated to verify UI state and element persistence. They do not prove uninterrupted audio delivery from third-party stations. Hadith success responses were not invented; credential failure was exercised instead.
- Automated axe WCAG A/AA scans reported zero violations on desktop Home and mobile Quran browser, Home, Radio, Tafsir, Quran reader and Hadith collection index. Keyboard checks passed for the first-tab skip link, main-content focus and opening the mobile menu. Automated scans are not a complete accessibility certification, particularly for image-only Quran content.

## Remaining integration requirements

1. The existing Quran endpoint supplies page images and timing information, not accessible verse text. Per-verse selection/bookmarks/copy, actual text-size controls, Ayah navigation, translations and screen-reader-readable Quran require a verified text/metadata adapter. Zoom controls enlarge images, not Quran text. Verse counts are not present in the existing Surah metadata and are not invented.
2. The integrated Tafsir source provides audio lessons (verified source name: الخلاصة من تفسير الطبري). Written Ayah-by-Ayah commentary, additional authors and source selection require a verified text Tafsir integration. No explanations or citations were generated.
3. HadithAPI needs a valid `VITE_HADITH_API_KEY`. Supply it in the deployment environment and rebuild. Live authenticated Hadith results remain to be verified with that credential. As in the original app, a Vite variable is visible to the client; a backend proxy is needed if the provider requires secrecy. Hadith bookmarks are local identifiers toggled in their chapter; no standalone saved-Hadith library was added.
4. Radio delivery, browser autoplay restrictions, API CORS, image availability and cross-origin audio download support depend on the actual provider and deployment. Retry/error feedback is provided. Verify real playback and downloads in the target browsers.
5. Existing English/French content selection remains available. The new application chrome is intentionally Arabic-first, not a fully translated new UI.
6. This is a frontend implementation, not a production deployment. The server must provide SPA fallback for direct routes. No theme toggle was added because the existing app did not support themes.

## Changed files

Existing files modified:

- `index.html`
- `package.json` (lint/test scripts only)
- `src/App.jsx`
- `src/index.css`
- `src/components/DownloadSong.jsx`
- `src/components/Tafasir.jsx`
- `src/pages/Discover.jsx`
- `src/pages/Radio.jsx`
- `src/pages/Surah.jsx`
- `src/redux/features/playerSlice.js`
- `src/redux/services/booksApi.js`

Files added:

- `src/components/layout/Header.jsx`
- `src/components/common/UI.jsx`
- `src/components/PersistentPlayer.jsx`
- `src/hooks/useStoredState.js`
- `src/pages/Home.jsx`
- `src/pages/Library.jsx`
- `src/utils/quran.mjs`
- `tests/quran.test.mjs`
- `docs/FRONTEND_REDESIGN.md`
