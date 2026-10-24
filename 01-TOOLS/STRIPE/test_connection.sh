#!/usr/bin/env bash
# Smoke-test of the connection to Stripe.
#
# 1. Checks the key is a restricted key (rk_) that matches STRIPE_ENV.
# 2. Reads the account balance (cheap GET).
# 3. Proves the key cannot write: POST /v1/products with no body. A key with
#    write access gets 400 "Missing required param" (nothing is created); a
#    read-only key gets 403 "required permissions". Anything else fails.
#
# Exit code: 0 if all three pass, ≠ 0 with detail on stderr otherwise.
#
# Usage:
#   ./test_connection.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_PATH="$SCRIPT_DIR/.env"
API="https://api.stripe.com/v1"

[ -f "$ENV_PATH" ] || { echo "ERROR: missing $ENV_PATH" >&2; exit 1; }

set -a
# shellcheck disable=SC1090
source "$ENV_PATH"
set +a

: "${STRIPE_API_KEY:?STRIPE_API_KEY not set in $ENV_PATH}"
STRIPE_ENV="${STRIPE_ENV:-test}"

case "$STRIPE_API_KEY" in
  rk_test_*) [ "$STRIPE_ENV" = "test" ] || { echo "FAIL — test key but STRIPE_ENV=$STRIPE_ENV" >&2; exit 1; } ;;
  rk_live_*) [ "$STRIPE_ENV" = "live" ] || { echo "FAIL — live key but STRIPE_ENV=$STRIPE_ENV (set live only on purpose)" >&2; exit 1; } ;;
  sk_*)      echo "FAIL — sk_ secret key has full access. Use a restricted key (rk_)." >&2; exit 1 ;;
  *)         echo "FAIL — not a Stripe restricted key (expected rk_test_ or rk_live_)" >&2; exit 1 ;;
esac

# 2. Read
body=$(mktemp); trap 'rm -f "$body"' EXIT
code=$(curl -sS -o "$body" -w '%{http_code}' -u "$STRIPE_API_KEY:" "$API/balance")
if [ "$code" != "200" ]; then
  echo "FAIL — GET /balance returned $code: $(jq -r '.error.message // .' "$body")" >&2
  exit 1
fi
available=$(jq -r '[.available[] | "\(.amount / 100) \(.currency | ascii_upcase)"] | join(", ")' "$body")
echo "OK — read works ($STRIPE_ENV). Available balance: ${available:-none}"

# 3. Write must be refused
code=$(curl -sS -o "$body" -w '%{http_code}' -u "$STRIPE_API_KEY:" -X POST "$API/products")
msg=$(jq -r '.error.message // ""' "$body")
if [ "$code" = "403" ] && grep -qi "permission" <<<"$msg"; then
  echo "OK — writes refused"
elif [ "$code" = "400" ]; then
  echo "FAIL — this key can write products. Remove write permissions in the dashboard." >&2
  exit 1
else
  echo "FAIL — unexpected answer to the write probe ($code): $msg" >&2
  exit 1
fi
