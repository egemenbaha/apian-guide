# Apian Wiki: repository navigation

## Scope

Turkish informational guide for Apian residents and incoming students. The guide is a dependency-free static site with a Wikipedia / Vector 2022 inspired design. The optional community forum uses MediaWiki with DiscussionTools in Docker and is currently disabled. The current guide renders reviewed FAQ content generated from PROJECT_DESCRIPTION.md. Preserve the integrated content and source links when changing the interface.

## Commit and push

Always commit and push completed repository changes after the relevant checks pass, without waiting for a separate request. For trusted maintainers `ardatas` and `egemenbaha`, the default workflow is to fetch the latest `main`, integrate changes without overwriting others' work, and push directly to `origin/main`. Do not create a task branch, pull request, or review request unless the user asks for one. Use the already authenticated authorized maintainer account; do not switch accounts merely to match an author name. Stage only files belonging to the task, keep credentials and local runtime data out of Git, and never force-push by default. Contributors without write access can use a fork and pull request as described in `CONTRIBUTING.md`. Verify that the remote branch matches the local commit and report the commit. If a check or push fails, resolve it where possible and report any remaining blocker. Follow an explicit user instruction to leave changes uncommitted or unpushed when given.

## Where to work

| Task | Entry point |
| --- | --- |
| Forum enable/disable switch (currently disabled) | `src/features.json` |
| Understand the project, source FAQ, and unresolved questions | `PROJECT_DESCRIPTION.md` |
| Setup and content policy | `README.md` |
| Shared page shell, header, search form, sidebar, appearance controls, footer | `index.html` |
| Topic titles, groups, subheadings, and stable topic IDs | `src/topics.js` |
| Landing page and topic-page markup | `home()`, `article()`, `tabs()`, `card()` in `src/app.js` |
| Hash routing, scrolling, active navigation, page titles | `render()` in `src/app.js` |
| Turkish title search and result links | `normalize()`, `searchTopics()` in `src/app.js` |
| Responsive menu behavior | `desktopMenu`, `resetMenu()`, toggle listener in `src/app.js` |
| Appearance behavior | `.appearance input` change listener in `src/app.js` |
| Wiki layout, typography, responsive rules, light/dark colors | `src/styles.css` |
| Header book/check logo and animation | `index.html`, `.brand-*` rules in `src/styles.css` |
| Shared favicon / optional forum logo and third-party notices | `src/forum-logo.svg`, `src/icon-licenses.txt` |
| FAQ generation and topic mapping validation | `scripts/generate-faq.mjs` |
| Markdown rendering and question search | `src/faq.js` |
| Packing checklist storage, progress and reset | `src/checklist.js` |
| Per-answer GitHub correction draft links | `src/corrections.js` |
| Generated FAQ data (ignored; regenerate from Markdown) | `src/faq-data.js` |
| Direct push and external contribution workflow | `CONTRIBUTING.md` |
| Static Vercel deployment configuration | `vercel.json` |
| Available commands | `package.json` |
| Static output generation | `scripts/build.mjs` |
| Local guide server and same-origin `/forum/` reverse proxy | `scripts/dev.py` |
| MediaWiki container, loopback port, persistent volume | `compose.yaml` |
| MediaWiki installation, migrations, and initial forum page | `forum/start.sh` |
| DiscussionTools, permissions, skin, and navigation notice | `forum/LocalSettings.php` |
| Apache `/forum/` alias | `forum/apache.conf` |
| Ignored local administrator credential generation | `scripts/forum-setup.mjs` |
| Forum login, topic/reply, and read-back integration check | `scripts/check-forum.py` |

## Navigation and data flow

`index.html` loads `src/app.js` as an ES module. It imports `topics` from `src/topics.js`, builds the navigation, and renders the requested page into `#page-content`.

- `#` opens the landing page.
- `#<topic-id>` opens a topic, for example `#camasirhane`.
- `#<topic-id>/bolum-<n>` opens a topic and scrolls to a section; section numbers follow the array order, starting at 1.
- `#konular` and `#hakkinda` open landing-page anchors.
- `#main` focuses the content skip-link target without changing the current topic.
- When enabled, `/forum/index.php?title=Talk:Forum` opens the MediaWiki discussion page. It is a server route, not a hash route. MediaWiki manages its own accounts, search, and discussion data.

Keep topic IDs stable because sidebar, search, and pagination links share them. Changing section order also changes numbered section links. Topic groups and their ordering come from `topics`; headings are rendered into HTML from this trusted repository data. Use DOM text APIs or escaping if content later comes from users or external sources.

FAQ search includes questions and answers; `#<topic-id>/soru-<n>` opens a question. Edit the Markdown source and the `questionIds` mapping when changing content. The dev and build commands generate FAQ data automatically.

Appearance controls set `data-text-size`, `data-width`, and `data-color` on the root element. The theme is also controlled from the header and persisted in the browser; preserve synchronization with appearance controls. Menu behavior switches at 901px; the appearance sidebar hides at 1200px and below.

## Content and design boundaries

Preserve the wiki design direction and Turkish interface. Consult `README.md` before changing content policy, and `PROJECT_DESCRIPTION.md` before extending topic coverage. Future FAQ content must distinguish Apian 1 / Apian 2, sources, and unresolved information. Do not append sharing/verification dates or generic room-variation disclaimers to answers. State measurements with the relevant building and keep the unmeasured-building status explicit. Preserve meaningful dates such as holidays and historical price examples; repository history records editorial checks. Keep the independent-guide disclaimer visible. Private chat exports and personal data stay outside the public source and build output.

## Run and verify

Use the commands in `package.json`; the requirements and local URL are documented in `README.md`. The build recreates `dist/` and copies only `index.html` and `src/`. Edit source files, not generated output. Root Markdown documents, forum configuration, and credentials are not included in the static build. A static host alone cannot serve forum routes.

The packing page (`#tasinma-listesi`) uses FAQ 113–115 Markdown checklist items. Keep its item text in PROJECT_DESCRIPTION.md; the `checklist` topic flag enables rendering and local progress. Verify check/uncheck, reload, reset, and blocked storage when changing this feature. Correction links must include the canonical question URL and open an unsubmitted GitHub issue draft. Visitors submit on GitHub; no credentials or automatic publication belong in the guide.

For forum changes, read the forum section of `README.md`. The shared `src/features.json` switch must explicitly enable the forum before `npm run forum:up` can initialize credentials and start Docker. While disabled, the guide hides forum links and the local server returns 404 for `/forum/`. To re-enable later, change `forumEnabled` to true, run `npm run forum:up`, and restart `npm run dev`. Preserve credentials and the data volume. Generated MediaWiki settings and SQLite data live in the named Docker volume. Preserve that volume and the ignored `.env`; setup preserves existing credentials. Configuration is copied into the container on startup, so restart the service after changing `forum/LocalSettings.php`. The service is bound to loopback for local use. Production requires separate server configuration and backups.

For UI changes, run `node --check src/app.js`, `npm test`, `npm run build`, and `git diff --check`. Verify the affected behavior in the local browser: landing page, topic route, section link, Turkish search (e.g. `camasir`), or responsive menu / appearance controls as appropriate. For forum behavior, run `python3 scripts/check-forum.py` against the running local services; it creates and deletes a unique test page. `vercel.json` configures the static guide; the MediaWiki service needs separate production hosting. A successful build or local preview is not a deployment.
