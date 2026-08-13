---
name: mcp-server
description: Build an MCP server so a model can use an external API or service as tools. Use when the user wants to connect a service to Claude, mentions MCP, or asks how to expose their API to an agent.
---

# Building an MCP server

An MCP server exposes tools to a model. The hard part is not the
protocol — the SDK handles that. The hard part is designing tools a
model can actually use without a human reading the API docs for it.

## Design the tools before writing any

**One tool per user intention, not per API endpoint.** An API with
twelve endpoints usually makes three good tools. Wrapping each endpoint
one-to-one produces a surface the model has to assemble a workflow from,
and it assembles it wrong.

**Name them as verbs on objects:** `search_orders`, `create_invoice`.
Not `handler_v2`.

**Descriptions are the documentation.** The model chooses a tool from
its description alone. Say what it does, when to use it rather than the
neighbouring tool, and what it does not do.

**Constrain the inputs in the schema.** Enums for fixed choices, formats
for dates, required fields marked required. Every constraint in the
schema is a class of mistake the model cannot make.

## Returns

Return text a model can act on. Not a raw JSON dump of a hundred fields
where four matter — that spends context and buries the answer.

Include what the next call will need: ids, cursors, the total count.
Cap list results and say the cap in the response, so the model knows
there is more rather than assuming it saw everything.

## Errors

Return the reason and the fix. "Not authorised" produces a retry loop;
"the token lacks the orders:read scope, re-authorise with that scope"
produces a correct next step.

Never return a stack trace. It is context spent on nothing.

## The things that break servers in practice

- **Writing to stdout.** With stdio transport, stdout is the protocol.
  A stray `print` corrupts the stream and the server dies with an
  unhelpful parse error. Log to stderr.
- **Slow tools with no timeout.** A call that hangs blocks the session.
- **Unbounded output.** A tool returning a whole file or table fills
  the context and ends the conversation early.
- **Destructive tools with no confirmation.** A tool that deletes must
  require an explicit identifier, never a filter that could match
  everything.

## Test it

Run the server, list the tools, and call each one — including with bad
input, to see what error text the model would receive. Then try the
real task through a model without explaining the tools to it. If it
picks the wrong tool, the description is wrong, not the model.
