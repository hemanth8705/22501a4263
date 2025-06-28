# URL Shortener

A simple, local-first URL shortener built with React, TypeScript, Vite, and Material UI.  
Includes a logging middleware for structured event logging.

## Features

- **Shorten URLs** with optional custom shortcodes and expiry time.
- **Track click stats** for each shortened URL (time, source, location).
- **View stats** for all your shortened URLs.
- **Local-first**: All data is stored in your browser's localStorage.
- **Structured logging**: Logs important events to a remote logging server.

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Material UI](https://mui.com/)
- Custom [logging middleware](../logging-middleware/src/logger.ts)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd UrlShortener/url-shortener
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Shorten a URL:**  
  Enter a long URL, optionally set expiry (in minutes) and a custom shortcode. Click "Shorten URLs".
- **View Stats:**  
  Click "📊 View Stats" to see all your shortened URLs and their click history.
- **Redirect:**  
  Visiting `/shortcode` will redirect to the original URL and log the click.

## Logging

This project uses a custom logging middleware ([logger.ts](../../logging-middleware/src/logger.ts)) to send structured logs to a remote server.  
Logs include events like invalid URL submissions and successful shortens.

## Project Structure

```
UrlShortener/
  url-shortener/
    src/
      pages/
        ShortenerPage.tsx
        StatsPage.tsx
        RedirectPage.tsx
      App.tsx
      main.tsx
      ...
    package.json
    vite.config.ts
    ...
  logging-middleware/
    src/
      logger.ts
    ...
```

## License

MIT ©
