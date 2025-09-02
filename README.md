# UnbAIsed

A Turborepo monorepo with Next.js frontend and Express API server.

## Apps

- **Web** (`apps/web`): Next.js frontend application
- **API** (`apps/api`): Express 5 API server

## Development

Run both applications in development mode:

```bash
pnpm dev
```

This will start:
- Next.js app on [http://localhost:3000](http://localhost:3000)
- Express API server on [http://localhost:3001](http://localhost:3001)


## Envs
### Api envs

OPENAI_API_KEY=

PORT=3001

WEAVIATE_API_KEY=

### Web envs

NEXT_PUBLIC_API_ADDRESS=http://localhost:3001/api (for development)

NEXT_PUBLIC_SITE_URL=not needed, used for metadata



## Build

Build all applications:

```bash
pnpm build
```
