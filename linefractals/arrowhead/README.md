# The Sierpiński arrow head

This is the first one I created using the recursive functions needed to implement the production rules:

* A → B-A-B
* B → A+B+A

Where `+` and `-` represent a change in direction of 60 degrees.

Every time the recursion reaches iteration zero it will draw a line from the 'current position' using 'the current
angle'.
This was a bit of a mystery to me: normally when using recursion the recursive functions maintain a local value of
most of the information in order to keep the isolated from other iterations. For the implementation of the mentioned
production rules there was a difference.

1) the current position of drawing should be kept global
2) when turning the angle, the angle should be kept global

There are solutions by which this information can be kept local and passed on to the next iteration, however, I choose
to use the more ['Turtle graphics'](https://en.wikipedia.org/wiki/Turtle_graphics) approach in which the turtle had a
global position and angle regardless the iteration.
Otherwise the turle has to jump around after each iteration.