# frontend

## Run + deploy

The frontend is built to be fully configurable and ready-to-go in under 10 minutes of dev time. Steps to customize and deploy:

1. Copy environment variables (`cp .env.sample .env.local`) and modify parameters
1. Then, `npm ci` (install dependencies) and `npm run dev` to run development build

## Updating database schema

To view in the browser the current state of the prisma DB (configured under `DATABASE_URL` in `./prisma/.env`), run `npx prisma studio`.

1. Update the schema in `./prisma/schema.prisma`.
1. Run `npx prisma generate` to generate the schema.
1. Run `npx prisma db push` to push the schema to the production Heroku database.
