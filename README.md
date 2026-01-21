# Matrix Terminal Chatbot

A Matrix-inspired terminal chatbot interface with n8n webhook integration.

![Matrix Theme](https://img.shields.io/badge/theme-matrix-00bfff)
![Vercel](https://img.shields.io/badge/deployed-vercel-black)
![n8n](https://img.shields.io/badge/backend-n8n-orange)

## Live Demo

**[claude-code-matrix.vercel.app](https://claude-code-matrix.vercel.app)**

## Features

- **Matrix Rain Effect** - Iconic falling code animation in the background
- **Terminal UI** - Retro terminal aesthetic with typing animations
- **n8n Integration** - Connect to any n8n workflow via webhook
- **Serverless Architecture** - Secure API proxy via Vercel Functions
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

| Frontend | Backend | Deployment |
|----------|---------|------------|
| HTML/CSS/JS | n8n Webhooks | Vercel |
| Canvas API | Vercel Functions | GitHub |

## Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│   Browser   │────▶│  Vercel Function │────▶│  n8n Cloud  │
│  (Frontend) │◀────│   /api/webhook   │◀────│  (Workflow) │
└─────────────┘     └─────────────────┘     └─────────────┘
```

The frontend never directly accesses the n8n webhook URL - all requests are proxied through a serverless function, keeping your webhook secure.

## Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/stanislash/claude-code-matrix.git
   cd claude-code-matrix
   ```

2. Start a local server
   ```bash
   python3 -m http.server 8000
   ```

3. Open http://localhost:8000

## Environment Variables

| Variable | Description |
|----------|-------------|
| `N8N_WEBHOOK_URL` | Your n8n webhook endpoint URL |

Set this in your Vercel project settings for production deployments.

## License

MIT
