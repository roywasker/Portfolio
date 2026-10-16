# MyPasswords project poster

Source screenshots copied from `MyPasswords/docs/screenshots`: welcome, saved passwords and add-password. The app README identifies these as Compose UI renders from local Robolectric tests with synthetic accounts. No real vault data is included.

The SVG layout places the original screens in device frames, matching the portfolio's landscape project-poster format. Navy and teal reference the app UI. Source images are not retouched.

Regenerate using `node scripts/build-my-passwords-poster.mjs`. This uses Sharp from the project's installed Astro dependencies and outputs `poster.svg`, `public/images/projects/my-passwords.avif` (1280×800) and `my-passwords-320.avif` (640×400, matching the existing responsive image convention).
