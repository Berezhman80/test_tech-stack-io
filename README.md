# Tech Stack

Test automation project for the tech-stack.io website.

## Technology Stack

- TypeScript
- Playwright
- Node.js

## Installation

```bash
npm install
npx playwright install
```

Copy `.env.example` to `.env` and set `LOGIN` and `PASSWORD`.

## Running Tests

```bash
npm test
```

Headed Chromium (local default for the chromium project):

```bash
npm run test:headed
```
