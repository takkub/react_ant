# Next.js Admin Dashboard

This project is a simple Next.js application that demonstrates building an admin dashboard using Ant Design components.

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env.local` and adjust the values as needed:

   ```bash
   cp .env.example .env.local
   ```

   The most important variables are:

   - `NEXTAUTH_SECRET` – secret used by NextAuth.
   - `SECRET_KEY` – key used to encrypt API requests.
   - `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` – database connection settings.
   - `NEXT_PUBLIC_API_BASE_URL` – base URL for API calls from the client.

3. **Run the development server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` in your browser.

## Project structure

- `app` – Next.js pages and API routes.
- `components` – React components used across the application.
- `lib` – Utility libraries and database helpers.
- `Layouts` – Layout components for different page groups.
- `store/context` – React context providers such as `DrawerContext` and `ThemeContext`.
- `theme` – Ant Design theme configuration.

## Scripts

- `npm run dev` – start the development server.
- `npm run build` – build for production.
- `npm start` – start the production server.
- `npm run lint` – run ESLint on the project.

## License
For open source projects, say how it is licensed.

This project is provided as‑is for demonstration purposes.
