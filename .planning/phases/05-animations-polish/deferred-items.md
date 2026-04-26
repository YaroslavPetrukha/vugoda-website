## 05-07 deferred items

- **src/components/sections/projects/StageFilter.tsx:60** — TS2322 error: `role` and `aria-label` props not allowed on Stagger component when used with `as="div"`. Discovered during 05-07 typecheck. Out-of-scope for 05-07 (Hero session-skip). Owned by Wave 3 sibling 05-04 (reveal-home-page) or 05-05a (reveal-zhk-page) which introduced the Stagger usage with role on /projects.
