# MyPasswords case study

Route: `/work/my-passwords/`. Enter through the second Work card. The shared header already marks Work selected on `/work/` routes.

## Source basis

Read-only source: `/Users/roywasker/AndroidStudioProjects/MyPasswords`.
Public source links use `https://github.com/roywasker/My_Passwords/blob/HEAD/`.

- `core/src/main/java/com/example/core/auth/VaultSession.kt`: generation tickets, session revocation, owned key buffer clearing and database close.
- `app/src/main/java/com/example/mypasswords/MainActivity.kt`: foreground-exit locking.
- `core/src/main/java/com/example/core/crypto/CryptoManager.kt`: authentication-bound Keystore key and AES-GCM field encryption.
- `core/src/main/java/com/example/core/data/VaultDatabase.kt`: Room with SQLCipher, owned passphrase cleanup.
- `core/src/main/java/com/example/core/data/dao/CredentialDao.kt`: transactional history/update, stale-value checks and restore ownership.
- Project README: offline scope, recovery limitations, trash cleanup triggers and screenshot provenance.

No security audit, production adoption, performance result or business metric is asserted. Proposed further verification is labeled as such.

## Demo boundary

`PasswordsDemo.astro` recreates the Hebrew RTL UI with original navy/teal colors. The fixed-height phone scrolls internally. Screens include welcome, simulated unlock, searchable/filterable vault, detail/reveal, preset account addition and trash/restore. Favorites, explicit locking, visibility-change locking and reset use in-memory state. Refresh discards changes.

No real credential entry, persistent vault, Android runtime, biometric authentication, cryptography, clipboard or external service is implemented. The only editable text field is search. Account fields are preset and read-only. Password history, recovery and password health are described as app capabilities, not simulated demo features.

## Images

`public/images/my-passwords/{welcome,passwords,add-password}.png` are copies of the Android repository's `docs/screenshots` renders. They were produced by that project's Compose/Robolectric UI tests using synthetic accounts. They are not fresh device captures or images of real credentials.

## Verification

- Browserless contracts cover page/assets/sitemap plus filtering, fixture addition, duplicate prevention, favorites and reversible deletion.
- `tests/passwords.spec.ts` covers card navigation, Work selection, complete interaction/reset, fixed device dimensions, responsive overflow, decoded screenshots, keyboard focus and accessibility in both themes, across the existing viewport projects.
- Run `npm run test:types`, `npm run test:contracts`, then `npx playwright test tests/passwords.spec.ts --workers=1` in an environment where Chrome can launch. Merely adding browser tests does not establish a passing visual/accessibility result.

Verification on 2026-10-12: production build and test typecheck passed; all 7 browserless contract tests passed. The focused mobile-small Playwright run stopped before navigation because Chrome exited with SIGABRT. Browser interactions, screenshots and axe assertions remain unverified in this environment.
