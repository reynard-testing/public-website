# Reynard Public Website

This repository contains a minimal website displayed at [reynard.dev](https://www.reynard.dev/).

## Getting Started

First, run the development server:

```bash
npm run dev
```

## Project Outline

The homepage is located in [src/app/page.tsx](src/app/page.tsx).
The page is made of a number of components, see [src/components/](src/components/).

The most fun component is the [ShadedBackground](src/components/ShadedBackground.tsx). This is inspired by a freeform gradient in illustrator, but then with moving parts. As this is not a CSS property, we created a OpenGL shader to render it.
