# Stripe

- **Qué es:** la conexión del agente con la cuenta de Stripe que cobrará los pagos del juego.
- **Para qué:** consultar pagos, saldo, productos y precios. No cobra: eso lo hará el juego.
- **Ruta:** API oficial de Stripe con una clave restringida de tipo agente. Ver `01-TOOLS/STRIPE/`.
- **Permisos:** solo lectura (saldo, pagos, cargos, sesiones de Checkout, productos, precios, clientes).
  Ninguna escritura.
- **Entorno:** primero el sandbox (claves `rk_test_`). Las claves reales (`rk_live_`) solo al publicar.
- **Dueño de las credenciales:** pendiente de rellenar en `01-TOOLS/STRIPE/CREDENTIALS.md`.
- **Fecha:** 2026-10-24.

## Cómo cobrará el juego (pendiente de decidir)

El juego es una página sin servidor. Una página así no puede guardar claves secretas. Hay dos caminos:

1. **Payment Link:** un enlace de pago creado en el panel de Stripe. El juego solo lo abre. Es lo más
   sencillo y no necesita servidor.
2. **Checkout con servidor:** un pequeño servidor crea cada pago. Hace falta si los precios cambian o
   si hay que saber qué jugador pagó para darle algo dentro del juego.
