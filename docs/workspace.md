# Workspace Shell

Milestone 3 turns the authenticated app into the permanent mikyasOS workspace frame.
It does not add CRM, Projects, Finance, AI chat, or other business modules.

All workspace work should follow the internal product standards in
[`docs/product-dna.md`](./product-dna.md) and
[`docs/design-language.md`](./design-language.md), and
[`docs/ux-information-architecture.md`](./ux-information-architecture.md). The shell
should make mikyasOS feel like one business operating system, not a set of disconnected
apps.

## Layout

Authenticated routes under `/app` render through `WorkspaceShell`.

The shell owns:

- Responsive sidebar with expanded, collapsed, and mobile drawer states.
- Sticky top navigation with breadcrumbs, page title, search, command palette access,
  organisation switcher, notifications, theme toggle, and user menu.
- Main content area for future modules.
- Reusable workspace settings placeholder at `/app/settings`.

Future authenticated modules should mount beneath `/app` so they inherit this layout.

## Navigation

Navigation is driven by `apps/web/src/features/workspace/config/navigation.ts`.
Each item contains:

- `title`
- `route`
- `icon`
- optional `permission`
- optional `badge`
- optional `featureFlag`
- `keywords`
- optional `disabled`

Disabled items are visible placeholders only. They intentionally do not implement
business workflows yet.

## Workspace Context

`WorkspaceProvider` supplies shared shell state through `useWorkspace`.

Available context includes:

- current user
- current organisation
- organisation list
- theme preference and resolved theme
- base permissions
- feature flags
- notification data
- AI status placeholder

The provider reuses the Milestone 2 identity API for organisations and organisation
switching. Notification data is mocked until a notifications backend exists.

## Theme

The theme store supports:

- `light`
- `dark`
- `system`

The preference is persisted in local storage under `mikyasos.theme`. The resolved theme
updates the root `dark` class for Tailwind.

## Command Palette And Search

The command palette opens with Ctrl+K or Command+K. It searches configured navigation,
quick actions, recent pages, and an AI placeholder.

Global search is UI-only. It prepares surfaces for customers, projects, tasks, documents,
employees, invoices, and AI memory without connecting business data.

## Notifications

The notification centre includes:

- unread badge
- grouped notifications
- mark all read action
- empty state
- loading-ready structure

The data is currently mocked inside the workspace provider.

## Accessibility

The shell includes keyboard-accessible buttons, labelled controls, focus rings,
screen-reader labels for icon-only controls, and Escape handling for modal surfaces.

## Performance

Authenticated workspace pages are lazy loaded with React `Suspense`. The shell is split
into focused components so future modules can reuse the frame without duplicating layout
logic.

## Premium Motion Layer

The workspace now includes a reusable mikyasOS motion layer:

- `premiumSpring` for natural spring movement.
- `pageTransition` for route-level fade, slide, and subtle scale.
- `cascadeContainer` and `cascadeItem` for progressive result/card entry.
- Ambient workspace background and selective glass panels.
- Tactile button hover, focus, active, and disabled feedback.
- Reduced-motion media-query safeguards.

Motion is used to communicate orientation, focus, hierarchy, and system feedback. It is
not intended as decoration.
