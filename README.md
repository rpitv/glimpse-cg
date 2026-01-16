# Glimpse Character Generator
Glimpse Character Generator or Glimpse CG is a specialized character generator designed 
for RPI TV to assist the creation of on-screen graphics and text overlays. It provides 
a user-friendly interface for generating professional-quality graphics suitable for 
broadcast and streaming applications.

## Installation

### Prerequisites
- Node.js v22.20.0
- Google Chrome (required for puppeteer-core)

### Install Dependencies
```bash
npm i
```

### Environment Variables
Create a `.env` file in the root directory and add the following environment variable:

```bash
CHROME_PATH=/path/to/your/chrome.exe
```
In `.env.sample`, the default path for Chrome on Windows is provided.

### Fontawesome PRO
This project uses Fontawesome PRO icons. To use them, you need to set up a `.npmrc` 
file in the root directory with your Fontawesome authentication token. This file is provided in the RPI TV discord server.

### Development
To start the development server, run:
```bash
npm run dev
```
The app will be available at: http://localhost:3000

### Build for Production
To build the application for production, run:
```bash
npm run build
```

### Preview Production Build
To preview the production build, run:
```bash
npm run preview
```
The app will be available at: http://localhost:3000