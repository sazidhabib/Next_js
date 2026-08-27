To set up your database schema and seed it with initial data, follow these steps:

1. Start the Next.js development server:
```bash
npm run dev
```

2. Synchronize and Seed the database:
Open your browser or make a request to:
`http://localhost:3000/api/admin/seed`

This endpoint syncs the Sequelize models to MySQL and populates the database with initial restaurants, categories, operating hours, delivery zones, items, and modifier groups.