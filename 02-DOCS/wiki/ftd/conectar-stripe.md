# Conectar Stripe

## Intent
El juego va a aceptar pagos. El agente necesita ver la cuenta de Stripe (pagos, saldo, productos)
de forma segura.

## Scope
- Dentro: herramienta `01-TOOLS/STRIPE/` de solo lectura, con su test; ficha en la wiki.
- Fuera: el cobro dentro del juego (Payment Link o Checkout); permisos de escritura; claves reales.

## Checklist
- [x] Investigar la documentación oficial — prueba: fuentes con fecha en `01-TOOLS/STRIPE/README.md`.
- [x] Crear la herramienta a partir de la plantilla — prueba: `.env.example`, `CREDENTIALS.md`, `README.md`, `test_connection.sh`, `list_payments.sh`.
- [x] El test rechaza configuraciones malas — prueba: ver Evidence.
- [x] `.env` queda fuera de git — prueba: `git check-ignore` lo confirma.
- [ ] El test pasa con una clave real del sandbox — prueba: `./test_connection.sh` imprime `OK — read works` y `OK — writes refused`.

## Evidence
- 2026-10-24, test con claves falsas en una copia temporal:
  - sin `.env` → `ERROR: missing …/.env`, código 1;
  - clave `sk_test_` → `FAIL — sk_ secret key has full access`, código 1;
  - clave `rk_live_` con `STRIPE_ENV=test` → `FAIL — live key but STRIPE_ENV=test`, código 1;
  - clave `rk_test_` inventada contra la API real → `FAIL — GET /balance returned 401: Invalid API Key provided`, código 1.
- `git check-ignore -v 01-TOOLS/STRIPE/.env` → ignorado por `01-TOOLS/STRIPE/.gitignore`.
- Sin verificar: el camino correcto (lectura OK y escritura rechazada con 403) necesita una clave real.

## Next
El dueño de la cuenta crea la clave restringida en el sandbox (pasos en `CREDENTIALS.md`) y ejecuta
`./test_connection.sh`.
