# Connected Business Ecosystem

Status: Internal Product Design Standard

## Purpose

mikyasOS is one connected business ecosystem. Customers influence projects, projects
create tasks, tasks create meetings, meetings create documents, documents support
decisions, decisions affect invoices, invoices shape analytics, and AI learns from the
permitted context across that graph.

No module should feel isolated. Every important record should explain what it belongs to,
who owns it, what changed, what it affects, and what action should happen next.

## Core Business Graph

The product uses a single mental model:

Organisation -> departments -> teams -> people -> customers -> projects -> tasks ->
meetings -> documents -> invoices -> analytics -> automation -> AI.

Individual screens may show only part of the graph, but navigation, search, activity,
permissions, and AI should preserve the relationships.

## Universal Object Standard

Every meaningful business object should expose:

- Organisation and owner
- Status and priority
- Permissions and visibility
- Activity timeline
- Comments or notes where collaboration is expected
- Attachments where supporting evidence matters
- Tags and saved filters
- Related records
- Notifications
- Search indexing
- Audit events
- Favourite, pinned, or recent state when useful
- AI-ready summary, citations, and suggested next actions when permitted

## Relationship Rules

Relationships must be clear enough that users can answer:

- What is this connected to?
- Who owns the next step?
- What changed recently?
- What is blocked?
- What needs attention today?
- What can be automated?
- What can AI explain with sources?

Cross-module actions should keep context. Creating a project from a customer should keep
the customer attached. Creating an invoice from a project should keep the project and
customer attached. Scheduling a follow-up from an invoice should appear in Today and the
calendar.

## Search And Command Layer

Global search and the command palette are the user-facing entrance to the graph. They
should support natural language, ranked results, recent searches, keyboard navigation,
quick creation, and open-result analytics across CRM, projects, tasks, documents, finance,
calendar, automation, notifications, and AI memory.

## AI Grounding

AI must use the connected graph as context, not as decoration. Answers should cite real
records, respect permissions, avoid inaccessible data, and offer confirmation cards before
creating or changing business objects.

## Automation

Automation should listen to graph events such as customer created, project started, task
blocked, document uploaded, meeting ended, invoice overdue, or workflow failed. Actions
should be logged, permission-aware, and reversible where practical.

## Golden Principle

Business is one connected system. mikyasOS should behave like the digital nervous system:
relationships visible, context preserved, work flowing, and intelligence grounded.
