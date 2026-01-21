# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Matrix-themed terminal chatbot interface with n8n webhook integration for AI responses.

**Live URL**: https://claude-code-matrix.vercel.app

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: n8n Cloud (webhook-based AI workflow)
- **API Proxy**: Vercel Serverless Functions
- **Deployment**: Vercel (auto-deploys from GitHub)

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main HTML structure |
| `styles.css` | Matrix theme styling |
| `script.js` | Chat logic, Matrix rain animation |
| `api/webhook.js` | Serverless proxy to n8n webhook |

## Local Development

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

Note: The `/api/webhook` endpoint only works when deployed to Vercel. For local testing, the n8n webhook can be called directly.

## Environment Variables (Vercel)

| Variable | Description |
|----------|-------------|
| `N8N_WEBHOOK_URL` | n8n webhook endpoint (kept secret, server-side only) |

## Architecture

```
Browser → Vercel Function (/api/webhook) → n8n Cloud → AI Response
```

The webhook URL is never exposed to the frontend - all requests proxy through the serverless function.

## Conventions

- Matrix theme uses blue color palette (`#00bfff`, `#0088cc`)
- Terminal-style UI with monospace fonts
- Typing animation for bot responses
