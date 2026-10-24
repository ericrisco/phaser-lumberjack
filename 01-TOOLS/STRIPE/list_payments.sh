#!/usr/bin/env bash
# Lists the latest payments (PaymentIntents) of the Stripe account. Read-only.
#
# Usage:
#   ./list_payments.sh        # last 10
#   ./list_payments.sh 25     # last 25 (max 100)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_PATH="$SCRIPT_DIR/.env"
LIMIT="${1:-10}"

[ -f "$ENV_PATH" ] || { echo "ERROR: missing $ENV_PATH" >&2; exit 1; }

set -a
# shellcheck disable=SC1090
source "$ENV_PATH"
set +a

: "${STRIPE_API_KEY:?STRIPE_API_KEY not set in $ENV_PATH}"

curl -fsS -G -u "$STRIPE_API_KEY:" "https://api.stripe.com/v1/payment_intents" \
  --data-urlencode "limit=$LIMIT" \
  | jq -r '.data[] | [(.created | todate), .id, .status, "\(.amount / 100) \(.currency | ascii_upcase)", (.description // "")] | @tsv'
