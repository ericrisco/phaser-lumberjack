# Credentials — Stripe

## Provider dashboard

- URL: https://dashboard.stripe.com
- Account: <owner email — fill in>
- 2FA: <yes/no, where the second factor lives — fill in>

## Variables

| Variable | Type | Where to generate | Rotation |
|----------|------|-------------------|----------|
| `STRIPE_ENV` | config | — (`test` or `live`) | — |
| `STRIPE_API_KEY` | secret | Dashboard → Developers → API keys → **Create restricted key** | When someone with access leaves, or on leak. Rotate from the key's ⋯ menu (old key keeps working up to 7 days). |

### How to create the key (sandbox first)

1. Open https://dashboard.stripe.com/test/apikeys (sandbox / test mode).
2. **Create restricted key**. When asked for the intended use, choose
   **Authorizing agent access to your account** (agent tag; required by Stripe MCP from December 2026).
3. Name: `lumberjack-agent-read`.
4. Permissions — **Read** only on: Balance, PaymentIntents, Charges, Checkout Sessions, Products,
   Prices, Customers. Everything else: **None**. No Write anywhere.
5. Copy the `rk_test_...` value into `.env`, then `chmod 600 .env`.
6. Run `./test_connection.sh`. It must print both `OK` lines.

Live mode (`rk_live_...`) only when the game goes to production, with the same permissions and an
access policy (Dashboard → Access policies).

## Never

- No `sk_...` secret key here: it has full access and the scripts refuse it.
- No key in the game's code (`src/`). The game is public; only a `pk_...` publishable key can live there.

## If a credential leaks

1. Expire the key immediately: API keys → ⋯ → **Expire key**.
2. Generate a new one and update local `.env`.
3. Review the key's request logs (⋯ → View request logs).
4. Log the incident with a date in this file.
