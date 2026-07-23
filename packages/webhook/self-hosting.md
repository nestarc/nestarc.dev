---
description: "Self-host @nestarc/webhook in your NestJS application, including runtime ownership, delivery operations, monitoring, replay, and production readiness."
---

# Self-hosting `@nestarc/webhook`

`@nestarc/webhook` runs inside your NestJS application and uses your PostgreSQL database. It provides the webhook delivery engine while your team retains control of the runtime, data, network policy, and operational experience.

## What You Operate

| Area | Your responsibility |
|------|---------------------|
| Runtime | Run the NestJS application and delivery worker |
| Storage | Operate PostgreSQL and the webhook tables |
| Endpoint management | Expose the package APIs through your own product or admin surface |
| Delivery visibility | Present delivery history and failure details to operators or customers |
| Recovery | Decide who can replay failed deliveries and how retries are monitored |
| Operations | Own deployment, scaling, alerts, backups, and incident response |

## What The Package Provides

- event and endpoint persistence
- fan-out delivery and delivery-attempt tracking
- HMAC-SHA256 signing
- exponential retry and circuit breaking
- multi-instance-safe work claiming with `FOR UPDATE SKIP LOCKED`
- stale-delivery recovery
- delivery history and manual retry APIs
- SSRF protections at endpoint registration and dispatch time
- ports and adapters for custom persistence and HTTP clients

## When Self-hosting Is A Good Fit

Self-hosting works well when:

- webhook delivery needs to stay inside your existing application and network
- your team already operates PostgreSQL and NestJS workers
- you want full control over data retention and security policy
- you have, or plan to build, an admin experience for endpoint management and replay
- your team can monitor retries, disabled endpoints, stuck deliveries, and delivery latency

The package supplies the core delivery mechanics. Your application remains responsible for the customer-facing and operational surface around those mechanics.

## Production Checklist

1. Follow the [installation guide](/packages/webhook/installation) and apply the SQL migration.
2. Review the [delivery lifecycle](/packages/webhook/how-it-works) and choose worker concurrency for your workload.
3. Expose [endpoint management](/packages/webhook/endpoint-management) through an authenticated API or admin UI.
4. Configure [retry and circuit-breaker behavior](/packages/webhook/retry-circuit-breaker).
5. Restrict access to [delivery logs and manual retry](/packages/webhook/delivery-logs).
6. Apply the [security guidance](/packages/webhook/security), including secret handling and outbound network controls.
7. Monitor queue depth, failure rate, disabled endpoints, stale deliveries, and delivery latency.

## Next Steps

- [Install `@nestarc/webhook`](/packages/webhook/installation)
- [Send your first event](/packages/webhook/sending-events)
- [Understand delivery guarantees](/packages/webhook/how-it-works#delivery-guarantees)
- [Use custom adapters](/packages/webhook/custom-adapters)
