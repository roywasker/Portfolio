# Trendy case study

Route: `/work/trendy/`, linked from the home page's selected-work section.
The Trendy project card itself opens the case study; its GitHub source remains linked from the case-study page and the hero preview.
Source reviewed: `/Users/roywasker/StudioProjects/Trendy`, 2026-10-12.
The application repository was read only. No credentials, services, Git state or app source were changed.

## Editorial evidence

- Shared UI: `composeApp/build.gradle.kts` declares Android and iOS targets and common Compose dependencies. `composeApp/src/iosMain/kotlin/org/roy/ecommerce_project/MainViewController.kt` hosts `App()` with ComposeUIViewController.
- Module boundaries and DI: `settings.gradle.kts`, `data/src/commonMain/kotlin/com/Trendy/data/domain/ProductRepository.kt`, and `di/src/commonMain/kotlin/com/Trendy/di/KoinModule.kt`. Repository interfaces are constructor-injected into ViewModels.
- Reactive cart: `feature/home/cart/src/commonMain/kotlin/com/Trendy/cart/CartViewModel.kt` uses flatMapLatest, unique product IDs, empty-list handling and combine. Missing products are omitted with mapNotNull; the case study explicitly describes that limitation.
- Request states: `shared/src/commonMain/kotlin/com/trendy/shared/util/RequestState.kt` defines Idle, Loading, Success and Error.
- Quantity: DetailsViewModel and QuantityCounter use a quantity selection; shared Constants sets MIN_QUANTITY=1 and MAX_QUANTITY=10.
- Images: original `image/homepage.jpg`, `image/categories.jpg`, and `image/cart.jpg` copied without alteration. These are repository screenshots, not new app executions.

The text distinguishes observed implementation, engineering interpretation and proposed next steps. No production adoption, measured performance or business outcomes are claimed.

## Demo boundary

Local HTML/CSS/TypeScript recreation, not an emulator or compiled KMP build. Sample products and prices; catalog, category filtering, details, quantity, cart editing, removal, review and reset. Colors reference the app's Colors.kt and screenshots. No account, API, payment or personal data entry. State stays in memory and resets on reload. Integer cents avoid floating-point currency arithmetic; quantity is limited to 10 per product. No pixel-perfect or behavioral parity is claimed.

The demo uses the app's local Bebas Neue and Roboto Condensed fonts. Its layout follows the original home carousel, discounted row, category list, white surfaces, yellow quantity controls and bottom icon navigation. The orange text is darkened for contrast. Product illustrations and sample data remain illustrative. A fixed-height grid keeps the device frame stable; only its content area scrolls. Browser tests assert the same device dimensions through catalog, categories, details, cart and review.

## Verification

`tests/contracts.spec.ts` covers static content, route, images, cart arithmetic and limits without a browser. `tests/trendy.spec.ts` covers navigation, complete cart journey, filtering, reset, bounds, keyboard focus, overflow, image decoding and axe checks in both themes across the existing viewport projects.

Run `npm run test:contracts`, then `npx playwright test tests/trendy.spec.ts --project=mobile-small --project=desktop`. Full verification: `npm run qa`. A successful build alone does not verify browser layout or Lighthouse performance.
