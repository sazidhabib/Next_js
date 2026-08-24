To set up your database schema and seed it with initial data, you can run the following commands in your project root:

1. Push the Prisma Schema
This command updates your database to match your Prisma schema (and creates the database if it doesn't exist yet):

bash
npx prisma db push


2. Seed the Database
Run the seed script directly using Node:

bash
node prisma/seed.js