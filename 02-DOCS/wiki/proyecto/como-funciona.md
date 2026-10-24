# Cómo funciona Lumberjack (explicado sin código)

Resumen técnico y comandos: ver el `README.md` en la raíz del proyecto.

## Qué es

Un juego de navegador. Un leñador corta un árbol que no se acaba nunca. Hay que esquivar las ramas
y darse prisa. Está hecho con Phaser 2, una caja de herramientas para hacer juegos web.

## Las piezas

Piensa en una obra de teatro:

- **El escenario** es `index.html`. Solo abre el telón y llama a los actores.
- **El director** es `src/GamePlay.js`. Decide qué pasa en cada momento. Es el único fichero con lógica.
- **El equipo técnico** es `src/phaser.min.js`. Pone luces, sonido y movimiento. No se toca.
- **El vestuario y los efectos** están en `assets/`: dibujos y sonidos.

## Cómo transcurre una partida

1. El juego carga dibujos y sonidos. Sale el botón Play.
2. Al pulsar Play empieza la música y se monta el árbol: 3 trozos limpios abajo y 10 al azar encima.
3. El árbol es como una **pila de platos**. Cada plato puede llevar una rama a la izquierda, a la derecha
   o ninguna.
4. Con la flecha izquierda o derecha, el leñador se coloca en ese lado y golpea. Se quita el plato de
   abajo, la pila baja y aparece un plato nuevo arriba.
5. Si el plato que queda abajo tiene rama en tu lado, la rama te aplasta: fin de la partida.
6. Arriba hay una **barra de tiempo**, como un reloj de arena. Se vacía sola. Cada golpe la rellena un
   poco. Si se vacía, también pierdes.
7. Cada golpe da 100 puntos. Al perder sale una lápida y el botón Play para repetir.

## Qué se puede cambiar fácilmente

Son "diales" dentro de `src/GamePlay.js` (la tabla exacta está en el README):

- lo rápido que se vacía el reloj;
- cuánto lo rellena cada golpe;
- los puntos por golpe;
- la distancia entre trozos de tronco.

## Cosas pendientes que conviene saber

- El juego no se centra en horizontal por una errata en una palabra.
- En pantallas rápidas (más de 60 imágenes por segundo) el reloj se vacía más deprisa.
- No hay récord guardado, ni dificultad que suba, ni controles táctiles para el móvil.
- Existe un estado "ganar" preparado, pero el juego no tiene final.
