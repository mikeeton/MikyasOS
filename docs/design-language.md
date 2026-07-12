# mikyasOS Design Language

Version: 1.0  
Status: Internal UI Standard

## Purpose

This document defines the visual and interaction language for mikyasOS. It is the source
of truth for UI, UX, components, motion, colour, typography, layout, icons, hierarchy,
and consistency.

Every screen should feel like part of one intelligent business operating system.

## Design Philosophy

mikyasOS should feel intelligent, premium, calm, elegant, fast, futuristic,
professional, enterprise-ready, and beautiful. It should never feel like a generic admin
template or a disconnected CRUD application.

The interface should communicate precision, confidence, clarity, elegance, performance,
depth, sophistication, intelligence, simplicity, and trust.

## Principles

- **Minimal but rich:** minimal interfaces, rich interactions, restrained colours, clear
  hierarchy, and meaningful information density.
- **Information before decoration:** every visual element must clarify state, meaning, or
  action.
- **Premium through simplicity:** confidence, restraint, whitespace, and calm alignment are
  preferred over loud visual effects.
- **Depth without chaos:** elevation, blur, glass, shadows, and layer transitions are used
  sparingly to show hierarchy.
- **Colour has meaning:** accents communicate module identity, state, priority, or action.
- **Motion has purpose:** motion communicates feedback, hierarchy, continuity, navigation,
  focus, completion, or direction.

## Token System

The design system is implemented through CSS variables in
`apps/web/src/styles/globals.css` and exposed through Tailwind where useful.

Core tokens include:

- background, foreground, card, surface, overlay, glass
- primary, secondary, neutral, muted, accent
- success, warning, danger, information
- border, input, ring, focus, hover, selected, disabled
- module accents for AI, automation, finance, CRM, analytics, documents, projects,
  calendar, notifications, and admin

Dark mode is the default premium experience. It should use deep neutral backgrounds,
soft elevation, readable typography, and muted colour. Light mode should feel clean and
comfortable, avoiding harsh pure white surfaces.

## Components

Components should support consistent states:

- default
- hover
- focus
- pressed
- loading
- disabled
- success
- error
- selected
- expanded
- collapsed

Cards, buttons, inputs, tables, charts, navigation, dropdowns, and notifications should
reuse the global premium classes before introducing one-off styles.

## Empty, Loading, And Error States

Empty states should explain why the screen is empty, teach the feature, suggest a next
step, and offer one primary action.

Loading should prefer skeletons, progressive rendering, animated placeholders, streaming,
and content-first rendering over generic spinners.

Errors should be human. Explain what happened, why it matters, and what recovery action is
available.

## Notifications

Notifications are durable operational records, not throwaway popups. They should support
grouping, filtering, priority, read/unread, archive, delete, undo, search, timeline, and a
dedicated notification centre.

## Dashboard

The dashboard is Mission Control. It should immediately answer:

1. How is my business?
2. What needs attention?
3. What changed?
4. What should I do?
5. What does AI recommend?

## AI Visual Identity

AI should feel like part of the operating system, not a simple chatbot. Use subtle glow,
streaming, thinking indicators, confidence, action suggestions, memory, and context
signals. AI surfaces must remain grounded and calm.

## Design Review Checklist

Before approving UI, ask:

1. Does it feel premium?
2. Does it reduce cognitive load?
3. Is hierarchy obvious?
4. Is spacing balanced?
5. Are colours consistent?
6. Does typography communicate importance?
7. Are interactions intuitive?
8. Does motion improve usability?
9. Would this still feel modern in five years?

Design is how the product thinks. Every colour, animation, button, card, and interaction
should help users run their business more efficiently.
