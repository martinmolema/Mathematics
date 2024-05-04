# The Peano Curve
In geometry, the Peano curve is the first example of a space-filling curve to be discovered, by Giuseppe
Peano in 1890. Peano's curve is a surjective, continuous function from the unit interval onto the
unit square, however it is not injective. Peano was motivated by an earlier result of Georg Cantor that
these two sets have the same cardinality. Because of this example, some authors use the phrase "Peano
curve" to refer more generally to any space-filling curve

Working example can be viewed [here](https://math.molema.org/linefractals/peano/).

## Introduction

I was looking at this curve and tried to discover how the iterations were built. This was a bit of a mystery. I saw
approximately where the similarities were, but the sizes didn't add up. This is best seen using images. 

## The shape repeats

The image below shows the starting situation ("iteration zero").

![peano-iteration-0.png](images/peano-iteration-0.png)

The image below shows the first iteration.

![peano-iteration-1.png](images/peano-iteration-1.png)

When fitting a resized image of "iteration zero", there seems to be missing certain portions. Have a look at the image
below. The image from "iteration zero" is resized, colored red with transparency and  superimposed over the first iteration.

![peano-iteration-1a.png](images/peano-iteration-1a.png)

When marking the missing parts red, the image below emerges.

![peano-iteration-1a.png](images/peano-iteration-1b.png)

When these parts are left out, one can easily see the pattern of "iteration zero" repeating, albeit in different orientation.

![peano-iteration-1b.png](images/peano-iteration-1c.png)

By marking the begin and end points with a green dot (start) and red dot (end), the pattern becomes even better visible.

![peano-iteration-1c.png](images/peano-iteration-1d.png)

So there are 4 configurations:
1. start at the bottom-left corner and draw up/right
2. start at the bottom-right  corner and draw up/left
3. start at the top-left corner  and draw down/right
4. start at the top-right  corner and draw down/left

## Pattern detection
But how is this pattern created?  After some research the shape is created using a simple question: 
> How can a line be drawn in an matrix of 3 times 3 cells, touching all cells while creating the shortest path?

The answer is simple and is displayed in the image below for one of the configurations as mentioned above.

![peano-iteration-0-rectangles.png](images/peano-iteration-0-rectangles.png)

Assigning letters to each rectangle makes it easier to work with. 

![peano-iteration-0+rects.png](images/peano-iteration-0+rects.png)

In this case the shape starts at cell `A` and ends at cell `G`. Notice how the shape is drawn using the center of each
of the cells. Now imagine that the next shape is positioned above the first one. See the image below. The first shape
is in the green rectangle, the second is in the blue rectangle. Notice the start and end points being marked with the
green (start) and red (end) circles. The second shape starts at cell `I`.

![peano-iteration-0+rects2.png](images/peano-iteration-0+rects2.png)

Now it is clear that we need a connection between cell `G` (green rectangle) and cell `I` in the blue rectangle.

## Dividing the canvas for *n* iterations
When we have a certain canvas (or plane) that we want to use for e.g. 4 iterations, we need to understand how to divide
the plane in rectangles. For every iteration the plane is divided in 9 rectangles:

![division-1.png](images/division-1.png)

The first iteration generates the green rectangles. The second iteration generates the blue rectangles. The third iteration
generates the yellow rectangles. Notice, this is just to get the idea. When the third iteration is viewed we get all
yellow rectangles:

![division-2.png](images/division-2.png)

So to calculate how many rectangles need to be calculated the following formula is used:

$f\left(n\right) = \left(3^2\right)^2$

So for iteration 4 we calculate the fourth power of 3 =>
$f\left(4\right) = \left(3^4\right)^2 = \left(3 * 3 * 3 * 3\right)^2 = 81^2 = 6561$ 
rectangles. (81 rows x 81 columns).

## The algorithm

Now we understand how the shapes must be layed out, we can construct an algorithm in pseudo code:
```text
  divide the given plane in rectangles
  start bottom/left corner
  
  set $direction = UP
  set $variant = RIGHT
  
  for each $col in columns
    repeat
      draw curve ($row, $col, $direction, $variant)
      switch $variant
      $row = next row using $direction
    until $row is valid
    switch $direction
  next $col
```

**Explanation:**
The trick is to follow the path:
> up -> right -> down -> right -> up -> right -> down -> right -> up

etcetera. When looking closely at the shapes that need to be drawn in this order, the variant is changing every time from right oriented
to left oriented. This simplifies our algorithm as we only need to switch to the other variant for every next shape. 
The direction needs to change if there is no more room going in that direction. Because we know the dimensions of our
plane (calculated in the number of rectangles vertically and horizontally) we can also use a simple `for` loop here. 
However, we need to setup this loop to go either forward or back depending on the loop having to go up or down.  

## Drawing the shape and definition of rows & columns

The drawing of the curve can be done using the given direction (up/down) and variant (left/right orientation). To actually
draw a shape it is best to split the given rectangle again in 9 rectangles, get the center of each rectangle and calculate
the 6 points. 

So the definition of a row and column is 
> the rows and columns are defined so that each cell defined by (column, row) can hold one shape.

For iteration zero there is therefore only one row and one column. For the first iteration there are 3 rows and
3 columns. This quickly amounts to los of rectangles! See the calculations below. 

* $f\left(0\right) = \left(3^0\right)^2 = \left(0\right)^2 = 1^2 = 1$
* $f\left(1\right) = \left(3^1\right)^2 = \left(3\right)^2 = 3^2 = 9$
* $f\left(2\right) = \left(3^2\right)^2 = \left(3 * 3\right)^2 = 9^2 = 81$
* $f\left(3\right) = \left(3^3\right)^2 = \left(3 * 3 * 3\right)^2 = 27^2 = 729$
* $f\left(4\right) = \left(3^4\right)^2 = \left(3 * 3 * 3 * 3\right)^2 = 81^2 = 6,561$


See the example of the first iteration below.

![definition-rows-and-columns.png](images/definition-rows-and-columns.png)

The blue rectangles define the rows and columns. The light gray rectangles are the support rectangles to be able to draw 
the shape. 

## The source code

Have a look at the function `draw` in the file `index.js`. There is some clutter there due to all the drawing
options, but the basics are clearly visible.