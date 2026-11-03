## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Tools and Scripts

### Boundary Checking
Check import boundary rules before committing:
```bash
pnpm check-boundaries
```

This enforces:
- core must not import from tenant (except integration via virtual module)
- domain must not import from external layers
- application must not import from infrastructure
- tenant must not contain logic imports (except overrides)

### Testing
- Run all tests: `pnpm test`
- Run domain tests: `pnpm test:domain`
- Run application tests: `pnpm test:application`
- Run e2e tests: `pnpm test:e2e`

### Build
- Build for production: `pnpm build`
- Preview production build: `pnpm preview`

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
