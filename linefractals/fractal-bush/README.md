# Fractal Bush

Creating a fractal bush using the L-rewrite system. See [Wikipedia](https://en.wikipedia.org/wiki/L-system">Wikipedia).
The fractal production rules for this specific fractal were obtained from [Paul Bourke](https://paulbourke.net/fractals/lsys/).

This fractal was a bit more difficult to program as there was only one variable. Apparently my understanding
of the L-rewrite system was not good enough. After some debugging I found that I decreased the number of
iterations too often, resulting in strange behaviour.

This is another step in understanding the L-rewrite system so I can develop some generic solution.

The further out the lines are, the less the opacity used (SVG Line attribute `stroke-opacity`). 
