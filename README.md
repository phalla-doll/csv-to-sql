# CSV to SQL

A web application that converts CSV files into SQL schemas for PostgreSQL databases (like Supabase).

## Features

- **CSV Upload**: Upload your CSV files easily
- **Schema Generation**: Automatically generates SQL schema from CSV columns
- **Column Mapping**: Preview and customize column names before export
- **PostgreSQL Ready**: Export SQL compatible with Supabase and other PostgreSQL databases

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [Shadcn UI](https://ui.shadcn.com) - UI components

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Upload a CSV file
2. Preview the detected columns and data types
3. Map/rename columns as needed
4. Generate and export the SQL schema
5. Insert into your PostgreSQL database (e.g., Supabase)
