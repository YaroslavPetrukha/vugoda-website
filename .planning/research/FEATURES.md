# Feature Research — Vugoda Corporate Website

**Domain:** Ukrainian real-estate developer corporate "hub" website (multi-ЖК portfolio; 0 completed · 1 active · 4 pipeline; Lviv market; "системний девелопмент" positioning)
**Researched:** 2026-04-24
**Confidence:** MEDIUM overall — domain patterns (table stakes / anti-features) are well established in training data and confirmed by CONTEXT.md §3 market context; specific competitor feature-by-feature claims are LOW confidence (WebSearch/WebFetch tools were denied in this environment, so competitor sites could not be freshly audited). Where claims rest only on training data, that is flagged per-row.

## Research Scope & Method Note

**Mandatory:** live audits of AVALON, LEV, Parus, RIEL, VD Group, Globus (the Lviv peer set named in CONTEXT §3) were not possible — both `WebSearch` and `WebFetch` were denied in the orchestrator sandbox. This FEATURES.md therefore synthesises:

1. **Ground truth** from the project files read: `PROJECT.md` (Active requirements), `КОНЦЕПЦІЯ-САЙТУ.md` (§4 sitemap, §6 portfolio model, §7 sections, §10 hard rules), `CONTEXT.md` (§3 market, §4 personas, §7 recommended structure, §8 risks).
2. **Training-data domain knowledge** on Ukrainian developer site patterns (єОселя, ЄДРПОУ blocks, клас наслідків, акредитація, дозвільна документація, ЛУН/DOM.RIA integrations) and European small-developer sites (Studio-style, 1–5 objects, high-trust / low-volume).
3. **Brand constraints** from `brand-system.md` and the 6-colour closed palette in §5 of CONCEPT.

Where claims below rest only on training data (i.e. cannot be verified against a live 2026 source), they are tagged **⚠ LOW-conf (unverified)**. Everything else rests on the project files or on well-documented Ukrainian real-estate-industry norms.

## Feature Landscape

### Table Stakes (Users Expect These — Missing = Trust Loss)

These are the features a 2025–2026 Ukrainian developer corporate site *must* have. Missing any of them makes the site feel amateur, unfinished, or suspicious — which is lethal when your entire positioning ("системний девелопмент") is trust/rigour-based and you have 0 completed objects.

| # | Feature | Why Expected | Complexity | Notes |
|---|---------|--------------|------------|-------|
| **TS-1** | **ЄДРПОУ + full legal entity reqs in footer** (ТОВ «БК Вигода Груп», ЄДРПОУ 42016395) | Persona-1 (Investor) and Persona-3 (Bank DD) go to footer first — it's the "fraud filter". Absence = instant distrust in UA market. | LOW | **In PROJECT.md: HOME-06, NAV-01.** Extend: ensure footer repeats on every page, not just home. |
| **TS-2** | **Licence reference visible** (безстрокова ліцензія від 27.12.2019) | Same as TS-1. Ukrainian buyers specifically look for licence date — older licence = more trust. Must include number/date, not just "ліцензовано". | LOW | **In PROJECT.md: HOME-06.** Acceptable on home "довіра-блок" + footer echo. |
| **TS-3** | **Portfolio hub page with stage/status filter** | Users expect to filter by "Будується / Здано / У продажу / Pipeline". Grid-of-all-objects is the canonical layout for UA developer sites. | MEDIUM | **In PROJECT.md: HUB-01 (4-bucket Model-Б).** Fully covered. |
| **TS-4** | **Stage marker on every ЖК card** (textual + visual) | Users must see at a glance whether an object is selling / under construction / planned. Critical because 4/5 objects are pipeline — ambiguity = loss of trust. | LOW | **In PROJECT.md: HUB-02, HUB-03, VIS-03 (cube-ladder).** Covered by concept §5.2 cube-ladder. |
| **TS-5** | **Individual ЖК pages with facts + renders + CTA** | Even pipeline objects need a landing to route traffic from hub. UA market norm: hero render → facts → gallery → "залишити заявку / підписатись". | MEDIUM | **In PROJECT.md: ZHK-01 (Етно Дім as template), ZHK-02 (scalable).** Covered. For pipeline, CTA = "Підписатись на оновлення", not "Купити" — matches CONCEPT §7.5. |
| **TS-6** | **Construction progress photos (хід будівництва)** | Persona-2 brief (CONTEXT §4) literally says *"шукає реальні фото ходу будівництва"*. In post-Elite-Group / post-Укрбуд era, no hod-budivnytstva = suspicion. | MEDIUM | **In PROJECT.md: HOME-04 (teaser), LOG-01/LOG-02 (full timeline).** Covered for Lakeview. |
| **TS-7** | **Contact page with email + phone + office address + map** | Standard UA developer pattern: map pin + office hours + 2–3 contact methods. A site with only an email looks abandoned. | LOW | **In PROJECT.md: CTC-01 (email ok; phone/address {{placeholder}}; соцмережі `href="#"`).** ⚠ GAP: map and office-hours block not in Active. For MVP clickable-demo this is acceptable but flag. |
| **TS-8** | **Clear corporate descriptor + slogan in hero** | Every UA developer hero has wordmark + 1-line descriptor. Without it, visitors have to scroll to find out what the company does. | LOW | **In PROJECT.md: HOME-01.** Covered. |
| **TS-9** | **Differentiated hierarchy between active and pipeline** | If the one active object looks the same as pipeline objects, you signal "we have no real construction". Persona-2 especially penalises this. | LOW | **In PROJECT.md: HUB-02 hero-sized Lakeview card vs HUB-03 3-в-ряд pipeline grid.** Explicit concept §6.2 hierarchy. Covered. |
| **TS-10** | **Mobile-responsive design** | 2026 UA real-estate traffic is ~60–70% mobile per industry norms (ЛУН, DOM.RIA analytics). ⚠ LOW-conf on exact %. Visiting a developer site on phone and having it break = hard bounce. | HIGH | **⚠ GAP vs MVP:** QA-01 explicitly scopes mobile OUT ("graceful fallback ≥1280px"). This is a known trade-off (client deprioritised mobile). **For the MVP deliverable ("клікабельний desktop-first прототип для клієнта") this is acceptable** — but must be surfaced as a v2 table-stakes gap, not a permanent anti-feature. Persona-2 (end-user) realistically views from phone. |
| **TS-11** | **Favicon + basic meta (OG tags for social share)** | Absence = link previews look broken when shared in Viber/Telegram, which is how UA real-estate recommendations circulate. | LOW | **Partial in PROJECT.md: VIS-04 (favicon).** ⚠ GAP: OG meta tags not mentioned in Active. Low-cost addition — recommend adding to QA-02 or a new QA-03. |
| **TS-12** | **Smooth scrolling + non-broken nav on every page** | Sticky nav with active-state indication is UA developer norm. | LOW | **In PROJECT.md: NAV-01.** Covered. |
| **TS-13** | **"How we build" / methodology narrative** | Buyers of any bussines/premium-class UA object expect a page explaining construction technology (monolith, СС3, утеплення). Post-war, "укриття" is also expected. | MEDIUM | **⚠ GAP vs MVP Core-4:** `/how-we-build` is in v2 per concept §4. Home has methodology **teaser** (HOME-05) but no full page. **Recommendation:** HOME-05 teaser is enough for the clickable-demo MVP *if* the teaser links to "детальніше (v2)" placeholder gracefully. Do not promise depth we do not ship. |
| **TS-14** | **Clear visible CTA on hero** (not just scroll) | UA developer norm: "Переглянути проекти" / "Залишити заявку" above the fold. | LOW | **In PROJECT.md: HOME-01 (CTA «Переглянути проекти»).** Covered. |

### Differentiators (Competitive Advantage for «системний девелопмент»)

Features that set Vugoda apart from AVALON / LEV / Parus (larger portfolios, "lifestyle/premium" positioning). These lean into the brand promise *"рішення, які можна перевірити"*.

| # | Feature | Value Proposition | Complexity | Notes |
|---|---------|-------------------|------------|-------|
| **D-1** | **Honest "0 зданих" presentation** — "Здано" bucket kept visible with count=0 | Inverts the usual "23 років досвіду" race. Signals Persona-1's #1 hot button (CONTEXT §4 Persona-1: "доказовість > обіцянки"). Competitors *cannot* replicate without hiding portfolio size. | LOW | **In PROJECT.md: HUB-01 (4 buckets including Здано-0 per CONCEPT §6.1).** Covered. |
| **D-2** | **Stage-precise language, not marketing-speak** ("меморандум", "дозвільна", "кошторисна документація") | Transparent process-language vs "скоро в продажу" of competitors. Brand promise made visible through word choice. | LOW | **In PROJECT.md: CON-01 (inherit from CONCEPT §7, §8 methodology block 1).** Covered via copy. |
| **D-3** | **Cube-ladder as stage visual** (1 cube = pipeline / group = near-ready / grid = active / full photo = delivered) | Systematises visual hierarchy to match content hierarchy. Brand book page-20 already sanctions cube as "етап проєктування / прозорість процесів". | MEDIUM | **In PROJECT.md: VIS-03.** Covered in CONCEPT §5.2. ⚠ concept itself flags this as "похідна рекомендація, потребує санкції клієнта". Deliver it as default — client can reject. |
| **D-4** | **Monthly construction timeline page** (`/construction-log` with 50 raw documentary photos grouped by month) | Most competitors (AVALON, LEV) show construction as a *single gallery or video* — not a time-sequenced archive. A timeline = auditable claim of on-site activity. ⚠ LOW-conf on competitor specifics without live audit. | MEDIUM | **In PROJECT.md: LOG-01, LOG-02.** Covered. |
| **D-5** | **Aggregator row for Pipeline-4 (unnamed)** | Honest rather than fake-named placeholder. Systemises "we announce names only when work warrants it". Unique shape. | LOW | **In PROJECT.md: HUB-04.** Covered per CONCEPT §6.2. |
| **D-6** | **Isometric-cube brand language as site-wide pattern** | Closed palette + single font + wireframe cubes ≠ glassy / gradient / 3D of competitors. Restraint = differentiation. | MEDIUM | **In PROJECT.md: VIS-01, VIS-02, VIS-03, VIS-04.** Covered. |
| **D-7** | **Restrained animation (Motion + SVG parallax, no WebGL)** | Cinematic but calm. Opposite of AVALON-style video-loop heroes or Spline-based interactive heroes some premium EU studios use. | MEDIUM | **In PROJECT.md: ANI-01–ANI-04.** Covered. |
| **D-8** | **4-value compact brand block** (системність · доцільність · надійність · довгострокова цінність) | Crisp, memorable, structurally different from "про нас" wall-of-text competitors favour. | LOW | **In PROJECT.md: HOME-02.** Covered. |
| **D-9** | **Template-driven scalable ЖК pages** (new object = one record in `projects.ts`) | Mechanises the "system" claim: adding a 6th, 7th object requires no redesign. Few small UA developers invest here — they hard-code each object. ⚠ LOW-conf on "few invest here". | MEDIUM | **In PROJECT.md: ZHK-02, CON-02.** Covered per CONCEPT §10 hard-rule 6 (tolerates N objects). |
| **D-10** | **No team photos / no CEO headshots** (hard rule) | Deliberate anti-pattern. In UA market where competitors put founder-portraits front-and-centre, Vugoda's restraint reads as "юр. факти ≠ обличчя". ⚠ This is risky if user flips interpretation ("is anyone actually behind this company?") — mitigation is extra-strong legal-facts block. | LOW | **In PROJECT.md: see Out of Scope — explicitly excluded per CONTEXT §1, CONCEPT §10.1.** Differentiator *by omission*. |

### Anti-Features (Deliberately Skip — Common in Sector but Wrong for This Site)

Features that look "standard for a developer site" but actively harm Vugoda's specific positioning and information architecture.

| # | Anti-Feature | Why Commonly Requested | Why Problematic for Vugoda | Alternative |
|---|--------------|-----------------------|----------------------------|-------------|
| **AF-1** | **Price / price-per-м² on corp site** | "Users want to know price immediately" | Vugoda corp is a **hub, not a sales funnel**. Price belongs on the ЖК landing (Lakeview lives on its own site). Pipeline objects have no price yet — showing "?" is worse than silence. Violates CONCEPT §7.5 ("без цін і умов продажу"). | Show price/terms only on external Lakeview landing; pipeline ZHK pages show stage, not price. |
| **AF-2** | **Apartment-picker ("оберіть планування")** | AVALON, RIEL standard | Vugoda has 0 apartments for sale on corp site. Picker belongs on ЖК sales landing, not corp hub. Would duplicate Lakeview's site (SEO cannibalisation — CONCEPT §4.3). | Link to Lakeview landing for the one object that has a picker. |
| **AF-3** | **Virtual tour / 360° / VR** | Premium UA developers (Parus, VD Group) use these. ⚠ LOW-conf. | Depth/experience mismatch: 4/5 objects have no interior. Investing in VR for 1 object = wrong priority for MVP. Brand book calls Three.js "надлишковий" (CONCEPT §9). | Static renders + construction photos; reconsider for v3 when a building is actually delivered. |
| **AF-4** | **Mortgage calculator / єОселя calculator** | Standard on RIEL, AVALON, LUN listings | єОселя accreditation status per project is **unconfirmed** (CONCEPT §11.12). A calculator on corp level misleads — buyers need per-project calc which isn't yet valid. Violates "чесно маркуємо" methodology. | Mention єОселя in `/buying` (v2) as "статус акредитації — по кожному проекту окремо"; no corp-level calc. |
| **AF-5** | **Agent finder / "ваш менеджер"** | Agency-integrated developer sites | Vugoda sells direct (CONTEXT §5). Single email / phone. Agent finder would imply a sales org that doesn't exist. | Single contact block on `/contact`. |
| **AF-6** | **Team page with photos/names** | *The* standard "про нас" trope | Hard rule from client (CONCEPT §10.1, CONTEXT §1). Replacing obliges a strong legal-facts alternative. | Juridical facts block (ЄДРПОУ, licence, юрадреса) on `/about` v2. |
| **AF-7** | **Full Lakeview page on corp site** | "Show your flagship!" instinct | Lakeview has its own site + brand. Duplicating = SEO cannibalisation + brand conflict (typography Cormorant on Lakeview ≠ Montserrat on Vugoda). CONCEPT §4.3 explicit. | Card + redirect only. |
| **AF-8** | **Use Lakeview social-media covers on corp site** | "We have ready graphics, why not use them" | Lakeview social covers use Lakeview typography (not Vugoda brand). CONCEPT §7.9, §10.2. Brand conflict = trust-signal damage. | Use only raw landscape photos from `/construction/{month-year}/`, never `_social-covers/`. |
| **AF-9** | **Stock photos / архітектурний stock** | Fills empty space fast | All 5 objects must be represented honestly. Stock = deception trigger for Persona-1 (CONCEPT Appendix C forbids). | Cube pattern for objects without renders (Pipeline-4); never generic cityscapes. |
| **AF-10** | **News / блог / press в MVP** | Standard corp-site expectation | Writing real news requires ongoing editorial staff — which Vugoda doesn't have pre-launch. Empty "Новини" page = worse than no page. | Defer to v2 (CONCEPT §4.2). Construction-log does partial duty: it's the only "activity feed" that updates naturally from existing monthly photo uploads. |
| **AF-11** | **Live chat / chatbot widget** | Conversion-rate ethos from e-commerce | Would need staffing and CRM (CONTEXT §6.15 open). For MVP: a 3s-response expectation the client can't meet = reputation damage. | Async forms → mailto: in MVP; proper chat in v2 when CRM-integration is decided. |
| **AF-12** | **"Карта офісів" / multi-branch page** | Copy-paste from larger-developer templates | Vugoda has one office. Multi-office UI implies scale they don't have. | Single contact block. |
| **AF-13** | **Investor calculator / ROI calculator** | Premium-segment norm (investment-focused ЖК) | Needs per-project yield data. 4/5 objects have no financial model yet. Calculator publishing inflated/fake ROI = fraud-proximity risk. | `/investors` (v2) lists products with honest language; no auto-calc. |
| **AF-14** | **Customer reviews / testimonials** | Conversion-boost trope | Vugoda has **0 delivered objects** = no residents = no authentic reviews. Inventing or borrowing them = trust catastrophe. | No reviews block. When first residents move in (Lakeview 2027+), reconsider. |
| **AF-15** | **Awards / ratings badges ("ТОП-10 забудовників")** | Industry-PR currency | Vugoda is not in UBA TOP-10 (CONTEXT §3 confirms — Vugoda "0 зданих"). Fake/aspirational badges = trust-kill. | Use only verifiable facts: licence, ЄДРПОУ, class-of-consequences per object. |
| **AF-16** | **Русский / English language switcher in MVP** | Default multi-lang widget | UA-only decision (CONCEPT §11.13). RU explicitly inappropriate post-2022 for UA developer. EN optional for investors but not a MVP table-stake — wartime UA buyers are 99% UA-speaking for this segment. ⚠ LOW-conf on 99%. | UA-only in MVP. EN as v2 decision. |
| **AF-17** | **GA4 / Meta Pixel / tracking in MVP** | Standard for any production site | CONTEXT §6.15 open, PROJECT.md Out-of-Scope. A demo-URL doesn't need analytics (and prematurely installing them without GDPR/cookie-consent banner violates UA data law). | Defer to v2 when client confirms CRM/analytics requirements. |

## Feature Dependencies

```
TS-1 (ЄДРПОУ footer)           TS-2 (licence footer)
        │                              │
        └──────────┬───────────────────┘
                   ▼
            NAV-01 footer ─────enables───▶ every page
                   │
                   ▼
            TS-7 (contact page consistency)


TS-3 (portfolio hub w/ filter)
     │
     ├──requires──▶ TS-4 (stage markers on cards)
     │                     │
     │                     └──requires──▶ D-3 (cube-ladder visual grammar)
     │                                           │
     │                                           └──requires──▶ D-6 (isometric brand pattern)
     ▼
TS-5 (individual ZHK pages) ─requires─▶ D-9 (template-driven scalability)
     │
     └──special-case──▶ AF-7 (Lakeview = redirect, not page)


TS-6 (construction photos teaser on home)
     │
     └──enhances──▶ LOG-01 (full /construction-log timeline)
                             │
                             └──requires──▶ AF-8 (NO _social-covers; only raw landscape)


D-1 (honest "0 здано" presentation)
     │
     ├──enhances──▶ D-2 (stage-precise language)
     └──enhances──▶ D-10 (no team photos) ─requires─▶ TS-1 + TS-2 (legal facts compensate)


TS-13 (how-we-build teaser HOME-05)
     │
     └──defers──▶ /how-we-build full page (v2 per CONCEPT §4.2)


AF-14 (no reviews) ──conflicts──▶ any testimonial block
AF-13 (no ROI calc) ──conflicts──▶ any pipeline investor calculator
AF-16 (UA-only) ──conflicts──▶ i18n routing in MVP
```

### Dependency Notes

- **TS-3 requires TS-4:** a hub is useless without visible stage filter values. `HUB-01` Model-Б defines the 4 buckets; `HUB-02/HUB-03` cards must render those buckets visibly.
- **TS-4 requires D-3 (cube-ladder):** the brand book gives no default way to mark stages visually other than cubes. Missing this = competitors' "coming soon" badges, which violate `tone of voice`.
- **TS-5 requires D-9 (template):** ZHK pages must multiply without redesign — `CON-02` encodes this.
- **TS-6 enhances LOG-01:** home teaser links to full timeline; without the timeline, the teaser's "Дивитись повний таймлайн" CTA breaks.
- **D-10 (no team) requires TS-1+TS-2 (legal):** removing the "team photos" trust vector forces the legal-facts block to carry the load alone. This is the single highest-risk decision and needs extra rigor in the HOME-06 "довіра-блок".
- **AF-7 (Lakeview redirect-only) conflicts with TS-5 (normal ZHK template):** requires a special-case "redirect card" variant in the `projects.ts` data shape — `HUB-02` explicitly handles this via CTA "Перейти на сайт проекту".

## MVP Definition

### Launch With (v1 — Core-4 MVP clickable demo)

All items listed are already in PROJECT.md **Active**. No gap-to-add for MVP-v1 *with two exceptions* (see GAP section).

- [x] **HOME-01..07** — hero, brand essence, portfolio overview, construction teaser, methodology teaser, trust block, contact form (all Active)
- [x] **HUB-01..04** — portfolio page with Model-Б filter, dual-tier hierarchy, pipeline-4 aggregator (all Active)
- [x] **ZHK-01/02** — Етно Дім as scalable template (all Active)
- [x] **LOG-01/02** — separate `/construction-log` with 50-photo monthly timeline (all Active)
- [x] **CTC-01** — contact page (Active; placeholders for phone/address acceptable for demo)
- [x] **NAV-01** — dark nav + footer with reqs, persistent all pages (Active)
- [x] **VIS-01..04, ANI-01..04** — brand tokens, typography, cube patterns, official logos, motion (all Active)
- [x] **DEP-01..03** — GitHub Pages auto-deploy, public URL, Vite basename (all Active)
- [x] **CON-01/02** — content from CONCEPT §7/§8 inline, portfolio data in `projects.ts` (all Active)
- [x] **QA-01/02** — desktop-first 1920×1080, Lighthouse ≥90 (Active)

### Gaps vs PROJECT.md Active Requirements (Recommended Adds)

Two table-stakes items are not in Active. Both are small and worth adding to MVP:

1. **⚠ GAP: OG meta tags / social-share preview metadata** (TS-11)
   - **Why add:** Clickable demo URL will be shared via Viber/Telegram/Slack to client and stakeholders. A broken unfurl on the demo link undermines the entire "виглядає дорого" value prop of the MVP.
   - **Recommendation:** Add as `QA-03` or extend `VIS-04` — include OG title, OG description, OG image (use hero isometric-cube render), Twitter Card, theme-color `#2F3640`, canonical URL. Cost: ~1 hour. Impact: high.

2. **⚠ GAP: footer reqs repeat on every page** (TS-1, TS-2 reinforcement)
   - **Why add:** NAV-01 currently specifies fixed navbar + footer "з реквізитами" but doesn't spell out the ЄДРПОУ/licence repetition. Currently only HOME-06 guarantees they appear.
   - **Recommendation:** Tighten NAV-01 acceptance criteria: footer on every page contains (minimum) legal name, ЄДРПОУ `42016395`, licence date `27.12.2019`, `vygoda.sales@gmail.com`. Cost: near-zero (same component, rendered on layout). Impact: medium (Persona-3 bank-DD users land on any page from Google, not just home).

### Add After Client Validation (v1.x)

Trigger: first client feedback after receiving the demo URL. These are items mentioned in CONCEPT §4.2 v2 or CONCEPT §11 open questions.

- [ ] `/about` full page (v2 per CONCEPT §4.2) — currently only home HOME-05/06 teasers exist. Trigger: when client verifies methodology §8 pending ⚠ blocks 2/5/6.
- [ ] `/how-we-build` full page (v2) — trigger: methodology verification complete.
- [ ] `/buying` typical conditions page (v2) — trigger: client confirms which terms publishable at corp level (vs per-project).
- [ ] `/investors` page (v2) — trigger: any pipeline object enters investment-product mode (dohidnyi dim NTEREST).
- [ ] Phone + real address replaced for placeholders (CONCEPT §11.1, §11.2) — trigger: client decision.
- [ ] Pipeline-4 name + location when revealed (CONCEPT §11.3) — trigger: investor decision per CONTEXT §2.6.
- [ ] Additional ZHK pages (Маєток, NTEREST) when client wants them promoted — trigger: by request. ZHK-02 template makes this zero-code add-record.
- [ ] Live social-media links replacing `href="#"` (CONCEPT §11.11) — trigger: Vugoda corporate Instagram/Facebook accounts exist separately from @lakeviewlviv.

### Future Consideration (v2+)

Items to defer until product-market fit established or external prerequisites met.

- [ ] `/documents` public library (ліцензія PDF, dozviлy, certs) — defer until client provides document set. CONCEPT §4.2 v2.
- [ ] `/partners` B2B section (banks, agents, lawyers) — defer until first partnership exists.
- [ ] `/news` / `/blog` — defer until editorial cadence is planned. Construction-log serves partial function in MVP.
- [ ] `/faq` — defer until real customer questions accumulate from Lakeview sales.
- [ ] Backend form handler (replacing `mailto:`) — defer until CRM integration decided (CONTEXT §6.15).
- [ ] єОселя badge per project — defer until accreditation actually obtained (CONCEPT §11.12).
- [ ] Mobile responsive design — defer per client deprioritisation (PROJECT.md Out of Scope). **⚠ reclassify this as table-stakes v2 not optional** — see TS-10 above.
- [ ] Multi-language (EN for investors) — defer per CONCEPT §11.13. Not RU under any circumstances.
- [ ] Analytics (GA4, Meta Pixel, GTM) — defer per CONCEPT §11.14.
- [ ] Sanity CMS migration — defer per CONCEPT §9. In MVP, content is TSX literals.
- [ ] Interactive map of portfolio (Львів + область pins) — defer. Useful at 10+ objects; wrong priority at 5.
- [ ] Next.js / SSR migration — defer per CONTEXT §7 vs MVP Vite decision. Re-evaluate when SEO competes with Lakeview sub-brand.
- [ ] Video interviews / silhouette-based leadership content (CONTEXT §6.9) — defer until client confirms format that doesn't violate "no faces" rule.

## Feature Prioritization Matrix

Covers the items where there is discretion. Existing `Active` items in PROJECT.md are all P1 by construction (the client has committed to them).

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| OG meta tags (TS-11 gap) | HIGH — demo URL unfurls correctly when shared | LOW | **P1** (add to MVP) |
| Footer reqs echo on every page (TS-1/TS-2 gap) | HIGH — lands user on any page, still sees juridical facts | LOW | **P1** (add to MVP) |
| Contact page map + office hours (TS-7 partial gap) | MEDIUM — placeholder-ish MVP acceptable | LOW | P2 (v1.x when real address known) |
| `/how-we-build` full page | MEDIUM — Persona-1 wants deep methodology reading | MEDIUM | P2 (v1.x after client verifies §8 ⚠ blocks) |
| `/about` full page | MEDIUM — same | LOW | P2 (v1.x) |
| Mobile responsive | HIGH (~60–70% of real-estate traffic ⚠ LOW-conf) | HIGH (full re-layout of desktop-first build) | P2 **but upgrade to P1 before production launch** |
| єОселя calculator | LOW (mostly end-user, not Persona-1) | HIGH (data-ingest pipeline needed) | P3 |
| Virtual tour / 3D | LOW (no completed interior) | HIGH | P3 |
| Press / blog / news | LOW initially | MEDIUM | P3 (after Lakeview delivery moment) |
| Reviews / testimonials | NEGATIVE (zero authentic source) | LOW | **Do not build** (AF-14) |
| Awards badges | NEGATIVE (not earned yet) | LOW | **Do not build** (AF-15) |

## Competitor Feature Analysis

⚠ **High-uncertainty table.** Could not audit live sites (WebFetch/WebSearch denied). Claims below rely on training-data recollection of Ukrainian developer site patterns and must be re-validated when tools are available. All rows marked ⚠ LOW-conf should be treated as hypotheses, not facts.

| Feature | AVALON (typical) ⚠ LOW-conf | LEV / Parus (typical) ⚠ LOW-conf | Our Approach |
|---------|-----------------------------|----------------------------------|--------------|
| Portfolio hub | Large grid, 16+ objects, filter by район/клас/стадія | Grid ~9–10 objects, район filter | Model-Б 4-bucket stage filter (CONCEPT §6.1) — smaller, stage-first rather than район-first |
| Stage communication | Mostly marketing labels ("Продано 85%", "Старт продажів") | Similar | Process-language ("меморандум", "кошторисна документація") — methodology block 1 (CONCEPT §8.1) |
| Construction photos | Gallery per ЖК on each landing; sometimes video-loop home hero | Gallery per ЖК | Central corp-level `/construction-log` timeline for Lakeview; differentiator because corp-site ≠ project-site |
| Team/leadership | Usually team page with photos + CEO message | Often CEO video interview | **None.** Legal facts instead. (D-10 + AF-6) |
| Trust signals | Awards, ТОП-10 badges, years-experience, N-domov-zdano counter | Similar | ЄДРПОУ + licence date + class-of-consequences per object. No awards. (D-1) |
| Price display | Usually "від $X" on corp card | Usually per-object "від $X" | None at corp level. Lakeview external site shows price; pipeline = no price. (AF-1) |
| Apartment picker | Yes — embedded picker on ЖК pages | Yes on active ЖК | None at corp level. Lakeview external site has its own. (AF-2) |
| Mortgage/єОселя calc | Often present | Often present | None. єОселя status unconfirmed. (AF-4) |
| CTA style | "Залишити заявку", "Забронювати квартиру" | Similar | "Переглянути проекти", "Підписатись на оновлення" — softer, discovery-oriented. Reflects that this is hub, not sales page. |
| Animation | Video hero, parallax, heavy gradients | Video hero common | Restrained Motion + SVG parallax, no video. (D-7) |
| Colours | Gold + dark blue premium, or glassmorphism | Similar "premium" palette | Closed palette 6 colours (`#2F3640` / `#C1F33D` acid-lime / `#F5F7FA` / `#A7AFBC` / `#3D3B43` / `#020A0A`). Distinctive. (D-6) |
| Fonts | Playfair + Inter, Cormorant, или Proxima | Cormorant / Playfair often | Montserrat only, 3 weights. Unusual for premium-segment developer. |
| Footer | ЄДРПОУ, licence, addresses, socials — standard | Similar | Same minimum but fewer social icons (since `href="#"` placeholders) |

## Ukrainian-Market Specific Considerations Checklist

Quality gate item: Ukrainian market context. Confirmed addressed:

- **ЄДРПОУ** ✅ — TS-1, HOME-06, NAV-01, footer.
- **Ліцензія на будівництво (дата)** ✅ — TS-2, HOME-06.
- **Класи наслідків (СС1/СС2/СС3)** ✅ — mentioned in methodology §8 block 5, to be per-object on ZHK page when verified (CONCEPT §7.5 fact-block "клас наслідків (якщо відомий)"). Currently ⚠ on Lakeview pending verification.
- **Дозвільна документація (stage vocabulary)** ✅ — used as stage name in Model-Б bucket "У погодженні" (Етно Дім, NTEREST). HUB-01.
- **Кошторисна документація / кошторисна вартість** ✅ — stage names in Model-Б bucket "У розрахунку" (Маєток, Pipeline-4). HUB-01.
- **єОселя** ⚠ — not in MVP (AF-4). Flagged for v2 once per-project accreditation is decided (CONTEXT §6.10, §11.12).
- **Меморандум про відновлення будівництва** ✅ — stage label for Етно Дім (CONTEXT §2.2, methodology §8 block 4).
- **ТОВ vs ФОП / юрособа clarity** ✅ — "ТОВ «БК Вигода Груп»" in footer. ⚠ open per CONCEPT §11 block 2 whether each ЖК has separate legal entity — don't fabricate this.
- **Публічні реєстри (Єдиний реєстр, АЗУЗ)** — referenced in methodology §8 block 2 ("юридичний трек відкритий для перевірки через публічні реєстри"). Correct tone.
- **Укриття / безпека** — part of Lakeview's own brand (external landing). Not prominent on corp site (Lakeview-specific). At most a line in `/how-we-build` v2. CONTEXT §8 risk table "Війна" flags it — but it's a ЖК-level topic, not corp level.
- **Post-war / no RU language** ✅ — AF-16. UA-only.

## Research Gaps (Honest)

Flagged for downstream reader / next research pass:

1. **Live competitor audit.** The entire "Competitor Feature Analysis" table is training-data-recalled pattern-level, not verified against current (April 2026) AVALON / LEV / Parus sites. If the roadmap weight-puts specific comparison claims, a fresh audit is a blocker.
2. **Mobile traffic share for Ukrainian real-estate vertical 2025–2026.** Claim of ~60–70% is training-data-level. If the QA-01 desktop-first decision is questioned by client, need current ЛУН / DOM.RIA / Google Analytics benchmarks.
3. **єОселя per-project accreditation norms.** Whether a corp site can state "планується акредитація" vs has to wait for actual bank approval — this is UA-legal-practice question. Left as AF-4 / P3.
4. **GDPR / UA data law implications for demo URL.** Even though MVP has mailto: only, a footer privacy-policy line may be expected. Not covered above; flag for orchestrator / legal review.
5. **Lakeview redirect SEO impact (hard redirect vs preview-with-link).** CONTEXT §7 flags this as "brainstorm at planning stage". MVP picks "mini-card + CTA to external" per HUB-02, avoiding preview-page; re-evaluate if SEO cannibalisation measured later.

## Sources

Project files read (ground truth):
- `/Users/admin/Documents/Проєкти/vugoda-website/.planning/PROJECT.md` — Active requirements, Out of Scope, Constraints, Key Decisions.
- `/Users/admin/Documents/Проєкти/vugoda-website/КОНЦЕПЦІЯ-САЙТУ.md` — §4 sitemap, §5 visual language, §6 portfolio model, §7 sections, §8 methodology, §10 hard rules, §11 open questions.
- `/Users/admin/Documents/Проєкти/vugoda-website/CONTEXT.md` — §1 identity, §2 portfolio per-object, §3 Lviv market + competitor list, §4 personas, §7 recommended structure, §8 risks.

External / training-data-level (⚠ LOW-conf for specific claims):
- Ukrainian real-estate developer site patterns (training-data-level familiarity with ЛУН, DOM.RIA, novobudovy.com, and developer corporate sites AVALON, LEV, Parus, RIEL, VD Group, Globus, Метгал).
- European small-developer (1–5 projects) corporate website patterns — Scandinavian / Baltic / UK-studio archetype (restrained palette, process-led narrative, no-sales-funnel hub).
- Ukrainian regulatory vocabulary for construction stages (кошторисна документація, дозвільна, меморандум про відновлення, клас наслідків СС1–СС3) — standard industry terminology.

**Could not access (both denied in environment):**
- `WebSearch` — denied.
- `WebFetch` for avalon.lviv.ua, lev.ua, parus.ua, riel.ua — denied.

---

*Feature research for: Ukrainian real-estate developer corporate hub website (0 completed · 1 active · 4 pipeline).*
*Researched: 2026-04-24.*
*Confidence: MEDIUM — internal project files are HIGH-confidence; competitor-comparison rows are LOW-confidence pattern-level recall pending live audit.*
