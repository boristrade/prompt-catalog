---
name: webhook-handler
description: Receive webhooks from a payment provider or external service correctly. Use when the user adds a callback endpoint, integrates payments, or reports that something was processed twice.
---

# Receiving a webhook

The sender will deliver the same event more than once, out of order, and
sometimes months late. It will retry until you answer 200. Everything
below follows from that.

## The four rules

**1. Verify the signature before reading the body.**
Compute it over the raw bytes, not over the parsed and re-serialised
JSON — reserialising changes key order and whitespace, and the signature
stops matching for reasons nobody finds quickly. Compare in constant
time.

An unsigned endpoint that grants access is a free access endpoint for
anyone who reads your docs.

**2. Be idempotent.**
Store the provider's event id, unique-constrained, and check it before
acting. Do the check and the work in one transaction — two separate
statements race, and under retries they will race, because retries
arrive in bursts.

This is what stops one payment extending a subscription twice.

**3. Answer fast, work after.**
Return 200 as soon as the event is stored. Work done before the
response counts against the sender's timeout, and a timeout means a
retry, which means the same work again.

**4. Answer 200 for events you ignore.**
A 4xx to an event type you do not handle makes the sender retry it
forever and eventually disable the endpoint.

## What to log and what never to log

Log the event id, the type and the outcome. On a failed signature check,
log the event id and nothing else — not the body, not the header, not
the computed digest. Those end up in a log aggregator that more people
can read than you think.

Never log the secret. Never accept it from a query parameter.

## Test it

- Send the same event twice and check the effect happened once.
- Send it with a wrong signature and check nothing happened.
- Send an unknown event type and check the answer is 200.
- Send an event for an object that does not exist locally and check the
  handler does not crash the endpoint for every subsequent event.

## Before finishing

State plainly what happens if the endpoint is down for an hour. If the
answer is "those events are lost", say it — most providers retry for
days, but only if you answered with an error rather than a 200.
