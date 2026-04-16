# Project Implementation Plan: AI Portfolio Integration

This document outlines the steps to integrate the UI fetched from Stitch and implement the AI-powered resume assistant functionality for Satya's portfolio.

## User Review Required

> [!IMPORTANT]
> The backend requires an LLM to generate responses as "Satya". I plan to use the `@google/genai` SDK for this. **You will need to provide a `GEMINI_API_KEY` in a `.env` file** once we start the server. Please confirm if this is acceptable, or if you prefer a different AI provider (like OpenAI or Anthropic).

## Proposed Changes

### Backend Setup (Node.js & Express)

- **`package.json`**: Initialize a new Node project and install dependencies (`express`, `cors`, `dotenv`, `@google/genai`).
- **`server.js`**: Create an Express server to:
  - Serve static frontend files (the HTML, CSS, JS from Stitch).
  - Expose the `POST /ask-ai` endpoint.
  - Inject the provided "Satya" context (Resume data) as a system prompt to the LLM.
  - Implement the routing logic handling the `question` and `mode` (Technical, Recruiter, Project).

### Frontend Routing & Page Linkage

- Move downloaded HTML files into a `public` directory.
- Rename `hero.html` to `index.html` (Main Page).
- Update the navigation links in all pages:
  - `Experience` -> `/`
  - `Projects` -> `/projects`
  - `AI Chat` -> `/chat`
- Ensure the "Talk to My AI" button in the Hero section seamlessly routes to `/chat`.

### Content Updates (Data Injection)

- Review `index.html` (Experience) and `projects.html` to ensure all details matching the prompt are fully injected. (The current Stitch export already has a lot of this, but will manually patch any missing tech stacks like LangChain, LangGraph, Ollama, ChromaDB, WebRTC, etc., as per the prompt's data).

### Chat UI Integration (`chat.html`)

- **Script Logic**: Add client-side JavaScript (`public/chat.js`) to `chat.html`.
- **Features to implement**:
  - Event listener for mode selection (Recruiter, Technical, Project).
  - Predefined question suggestions rendering and on-click triggers.
  - API call logic to `/ask-ai` with UI updates (loading, typing animation).
  - User and AI message rendering, ensuring auto-scroll to the bottom.
  - Debounce logic on the input to prevent duplicate requests.
  - Copy response button, clear chat utility, and error fallback states.

## Open Questions

> [!WARNING]
> Do you have a preferred port for the backend server (e.g., 3000)? And are you comfortable creating a `.env` file with an API key, or would you like me to build a mock response engine for testing first?

## Verification Plan

### Automated/Manual Testing
- Start the server using `npm start`.
- Navigate through `/`, `/projects`, and `/chat` to ensure links and layouts are perfectly preserved.
- Use the Chat feature on `/chat`:
  - Ask a predefined question.
  - Test all three modes (recruiter, technical, project) to verify the response tone changes.
  - Test responsiveness on a smaller window size.
