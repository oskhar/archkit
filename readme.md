# 🚀 init-repo-template

A professional and opinionated GitHub repository template to improve **consistency**, **collaboration**, and long-term maintainability for open-source or private projects.

> 📦 Ready-to-clone setup for teams who care about clean Git history and a clear collaboration flow.

Related article:
[https://dev.to/oskhar/commitizen-making-git-commits-the-right-way-g70](https://dev.to/oskhar/commitizen-making-git-commits-the-right-way-g70)

## Why this template?

This template helps you avoid:

- inconsistent commit messages
- unclear contribution rules
- repetitive repo setup across projects

It’s designed to be **reusable**, **team-friendly**, and **tool-agnostic** (not tied to Node.js projects).

## What’s included ✨

- `.czrc` for Commitizen-based interactive commits
- Conventional Commits & semantic versioning support
- Clear collaboration rules in `collaboration_guide.md`
- GitHub-ready structure (`.github`, docs-friendly layout)

## Getting started

### 1. Clone the template

```bash
git clone https://github.com/your-username/init-repo-template.git your-project-name
cd your-project-name
```

### 2. Read the collaboration guide

Before committing anything, read:

- `collaboration_guide.md`

It explains commit rules, branching, PR flow, and review etiquette.

### 3. Initialize your repository

```bash
git init
git remote add origin <your-new-repo-url>
npm install -g commitizen cz-git
```

> 💡 `.czrc` is already included — you can use `git cz` immediately.

## Commit workflow 🧠

This template uses **Commitizen** to keep commit messages consistent and meaningful.

To commit:

```bash
git add .
git cz
```

Follow the interactive prompt and let the tool guide you.

## Collaboration rules 🤝

- Do not commit directly to `main` (except initial setup)
- Always follow the commit convention
- Open pull requests with clear intent and scope

All details are documented in `collaboration_guide.md`.

## Suitable for

- Open-source repositories
- Internal company projects
- Monorepo bootstrapping
- Teams learning proper Git practices

## 📜 Governance

This project is governed by the [**Project Constitution**](.specify/memory/constitution.md). 

All contributions must adhere to:
- **Experiment Integrity**: Maintaining comparability between Monolith and Hybrid implementations.
- **SCS Discipline**: Atomic changesets tracked via mandatory branch naming.
- **Architecture Parity**: Alignment with the shared OpenAPI specification.

Refer to the constitution for detailed rules, metrics requirements, and architectural constraints.

## Project Architectures

This project implements the same business logic in two different architectural patterns to compare development complexity:

1.  **Monolith**: A NestJS modular monolith using TypeORM and Zod for validation.
2.  **Hybrid**: A microservices-based architecture using NestJS, CQRS, and Kafka for event-driven communication.

### Architecture Parity

Both architectures are aligned to provide the same API endpoints and domain capabilities:

-   **Diagnostic Endpoints**:
    -   `GET /health`: Service health status
    -   `GET /diagnostics/ping`: Connectivity check
-   **Product Domain**:
    -   `POST /products`, `GET /products`, `GET /products/:id`, `PATCH /products/:id`, `DELETE /products/:id`
-   **Sales Domain**:
    -   `POST /sales/transaction`, `GET /sales/transactions/:id`
-   **Inventory Domain**:
    -   `POST /inventory/adjust`, `GET /inventory/:productId`

For detailed verification steps, see [Architecture Parity Verification](./specs/017-architecture-parity-alignment/quickstart.md).
