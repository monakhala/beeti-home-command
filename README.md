# Beeti Home Command

Create a demo for Beeti (بيتي) - the Egyptian Household AI Operations Platform based on the attached startup document (Section 8 / Beeti life administration agent).

Key requirements:
1. Design & UX:
- Clean, visually appeasing UI with an editorial, calm command center feel.
- Absolutely NO AI slop: no floating spark emojis, no eyebrows/pill badges stacked on headers, no purple gradients, and NO nested rectangular card boxes.
- Focus on seamless visual flow, fluid timeline navigation, and slide-out inspection sheets for details.
- Subtle Egyptian / MENA localization cues (EGP currency, English UI with natural Arabic typography touches for "بيتي", local Egyptian providers like WE, Vodafone Egypt, New Administrative Capital compound services, electricity cards).

2. Core Functional Modules:
- Household Life Timeline: A fluid river of active obligations, upcoming contract expiries (e.g. WE home fiber expiring in 12 days), and scheduled household appointments.
- Personal Vault: Structured repository for household contracts, bills, and warranties with extracted metadata and document preview.
- Task Delegation & Execution Agent: Natural-language request input that converts into structured tasks with defined outcomes.
- Trust Center & Approval Gate: Side-by-side action diff (before vs after terms, verified EGP savings, risk level) where the user reviews and authorizes agent actions before execution, with a complete audit trail.

3. Token Optimization Architecture:
- Showcase the architectural principle: deterministic state tracking for 85% of logic (0 tokens burned on routine date/status tracking) and lean, cached JSON schemas for document parsing and negotiation drafts.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://beeti-home-command.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/267b8a9c-bcda-4534-ad66-5d8ad2638425).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
