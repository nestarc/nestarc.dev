---
description: "Compare self-hosted @nestarc/webhook with Nestarc Webhooks Cloud, including ownership, retry, logs, replay, billing, and recommended use cases."
---

# Self-hosted Webhooks vs Nestarc Webhooks Cloud

`@nestarc/webhook` and [Nestarc Webhooks Cloud](https://webhook.nestarc.dev) solve the same product problem at different operating levels.

Use `@nestarc/webhook` when you want webhook delivery embedded inside your own NestJS application and you are comfortable operating the database tables, delivery worker, endpoint management API, logs, replay flows, and customer-facing UI yourself.

Use Nestarc Webhooks Cloud when webhook delivery is customer-facing infrastructure and you want Nestarc to operate the delivery pipeline, retry behavior, logs, replay, and dashboard for you.

## Quick Comparison

| Area | `@nestarc/webhook` | Nestarc Webhooks Cloud |
|------|--------------------|------------------------|
| Target | Webhook handling inside a NestJS app | External webhook delivery operations |
| Operating responsibility | You | Nestarc |
| Runtime | Your app, database, and worker process | Managed Cloud delivery pipeline |
| Retry | Configured and operated in your app | Managed by Cloud |
| Delivery logs | Build and expose them yourself | Provided in the dashboard |
| Replay | Implement with your own admin surface | Available from the dashboard |
| Endpoint management | Use the package APIs to build your own UI/API | Managed in Cloud |
| Billing | None | Free / Starter / Pro |
| Recommended use | Internal event publishing and self-hosted delivery | Customer-facing webhook delivery |

## How They Relate

`@nestarc/webhook` is the open-source NestJS package. It gives your application the primitives for outbound webhooks: event persistence, endpoint records, delivery attempts, HMAC signing, retries, circuit breaking, and delivery logs.

Nestarc Webhooks Cloud is the hosted product. It provides the operational layer around those same webhook delivery concerns: a managed delivery service, dashboard, logs, replay, endpoint operations, and plans for teams that do not want to build and run that surface themselves.

The simplest way to think about it:

- `@nestarc/webhook` gives you the webhook engine.
- Nestarc Webhooks Cloud runs the webhook operations platform.

## Can I Self-host?

Yes. `@nestarc/webhook` is designed for self-hosted use inside a NestJS application. You install the package, create the webhook tables in your PostgreSQL database, register `WebhookModule`, and run the delivery worker as part of your application.

Self-hosting is a good fit when:

- webhook delivery is mostly an internal capability
- you already have an admin product surface for customers or support teams
- you want full control over storage, network policy, and deployment
- your team is ready to own retries, stuck delivery recovery, replay UX, and operational alerts

Self-hosted does not mean unfinished. The package includes the core delivery mechanics. It does mean the operational product around those mechanics is your responsibility.

## What Changes With Cloud?

Cloud moves webhook delivery operations out of your application. Instead of building your own dashboard and operational workflows around `@nestarc/webhook`, you use a managed service for customer-facing webhook delivery.

Cloud is a better fit when:

- webhook delivery is part of your customer-facing product
- customers need visibility into delivery attempts
- support teams need logs and replay without database access
- you want retry and delivery behavior managed outside your app runtime
- you want a hosted dashboard instead of building one
- webhook reliability is becoming a product expectation, not just an implementation detail

## Can I Use Only The Open-source Package?

Yes. You can use only `@nestarc/webhook` and never use Cloud.

That is the right choice when you want webhook capability inside your own app and prefer to operate everything yourself. There is no Cloud dependency in the package, and no billing requirement for self-hosted use.

The tradeoff is ownership. With the open-source package, your team owns the production surface around webhook delivery: endpoint configuration, customer visibility, replay workflows, support tooling, monitoring, and incident response.

## When To Choose Which

Choose `@nestarc/webhook` when you are adding webhook delivery to a NestJS app and want to keep all infrastructure inside your own system.

Choose Nestarc Webhooks Cloud when webhook delivery is part of your product experience and you want a managed operational surface for customers, support, and production reliability.

Many teams can start self-hosted and move to Cloud when webhook delivery becomes important enough that logs, replay, support workflows, and operational ownership deserve their own product surface.
