# Documentar el proyecto

## Intent
Dejar el proyecto entendible para quien lo abra: cómo arrancarlo, cómo se juega, cómo está hecho y
qué falla. Base para pulir y ampliar el juego (objetivo del perfil).

## Scope
- Dentro: `README.md` técnico; página de wiki sin código (`02-DOCS/wiki/proyecto/como-funciona.md`).
- Fuera: cambiar código o arreglar los fallos encontrados (solo se documentan).

## Checklist
- [x] README reescrito con arranque, controles, estructura, funcionamiento, ajustes y fallos conocidos — prueba: contenido contrastado con `src/GamePlay.js`, `package.json`, `index.html`.
- [x] Página de wiki con analogías — prueba: `02-DOCS/wiki/proyecto/como-funciona.md` existe.

## Evidence
- 2026-10-24: valores del README leídos del código: lienzo 320×480, pool de 30 troncos,
  `distanceTrunks = 70`, `refreshBar(6)` por tronco y `refreshBar(-1)` por fotograma, 100 puntos por golpe,
  puerto 10001 en el script `lite`, Phaser v2.10.0 en la cabecera de `phaser.min.js`.
- Fallos detectados al leer: errata `pageAlignHoritzontally`, barra dependiente de los FPS, log de
  "GAME OVER" en cada fotograma, `<!DOCTYPE>` incompleto, `STATE_GAME_WIN` sin uso.
- No verificado: `npm start` (no hay `node_modules` instalado).

## Next
Elegir si se arreglan los fallos conocidos (cambio pequeño, carril FTD).
