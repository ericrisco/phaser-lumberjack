# STRIPE

> Read-only connection from the agent to the Stripe account that will collect the game's payments.

## When to use

To check payments, balance, products and prices without opening the dashboard. It does **not**
take payments: that is the game's job (see *Next step* below).

## Route

Official Stripe REST API with a **restricted key, agent-tagged, read-only**, sandbox first.

Alternative: Stripe's official MCP server (`https://mcp.stripe.com`, OAuth or agent key). Its
`stripe_api_write` tool can create and refund, so if it is added later, grant it read-only
permissions and keep tool approval on.

## Setup

1. `cp .env.example .env && chmod 600 .env`
2. Create the key as described in `CREDENTIALS.md` and paste it into `.env`.
3. `./test_connection.sh` — should end with `OK — writes refused`.

Needs `curl` and `jq`.

## Scripts

| Script | What it does | Example |
|--------|--------------|---------|
| `test_connection.sh` | Checks key type, reads the balance, proves writes are refused. | `./test_connection.sh` |
| `list_payments.sh` | Lists the latest PaymentIntents (date, id, status, amount). | `./list_payments.sh 25` |

## Permissions granted

Read: Balance, PaymentIntents, Charges, Checkout Sessions, Products, Prices, Customers.
Write: none.

## Operational notes

- Sandbox (`rk_test_`) and live (`rk_live_`) are separate worlds with separate keys and data.
- The write probe sends `POST /v1/products` with no body. With write access Stripe answers
  400 "Missing required param" and creates nothing; read-only answers 403.
- Next step for the game: it is a static page with no server, so it cannot hold a secret key.
  The simplest way to charge is a **Payment Link** (created in the dashboard, opened from the
  game). Checkout with a server is the alternative if prices or users vary.

## Sources (read 2026-10-24)

- API keys, restricted and agent keys: https://docs.stripe.com/keys
- Stripe MCP server: https://docs.stripe.com/mcp
- Balance endpoint: https://docs.stripe.com/api/balance/balance_retrieve
- PaymentIntents list: https://docs.stripe.com/api/payment_intents/list
