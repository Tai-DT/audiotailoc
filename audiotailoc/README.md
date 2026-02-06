## Audiotailoc Monorepo

- Packages: `backend`, `frontend`, `dashboard`, `shared/api-sdk`
- Shared config: `tsconfig.base.json`, ESLint, Prettier, EditorConfig

### Scripts
- Install: `npm install`
- Build all: `npm run build`
- Dev (concurrently): `npm run dev`
- Lint all: `npm run lint`

### Notes
- Each package has its own `tsconfig.json` and `package.json`.
- The SDK builds to `shared/api-sdk/dist` and is consumable by other packages.