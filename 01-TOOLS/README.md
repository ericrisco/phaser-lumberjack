# 01-TOOLS

Connections from the agent to external services. Each folder holds its own `.env` (never committed).

| Tool | What for | Access | Test |
|------|----------|--------|------|
| [STRIPE](STRIPE/README.md) | Check the game's payments, balance and products | Read-only, sandbox first | `STRIPE/test_connection.sh` |
