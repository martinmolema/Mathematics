#Random Sierpinski

This game goes as follows:

1. Put three dots on a piece of paper so they form the corners of a triangle.
1. Add numbers to each dot: the first gets 1 & 2, the second 3 & 4 and the thirst gets 5 & 6.
1. Place a new dot somewhere in the (virtual) triangle
1. Throw a die and read the number of eyes visible.
1. Lookup the corner using the number of eyes from the die. So if the die shows 3 eyes, then select the 2nd corner
1. Now draw an imaginary line between the dot from step 3 and the selected corner
1. Draw a new dot halfway on this imaginary line.
1. Use this new dot as the starting point and iterate from step 4
1. Question: what is the expected image that will appear from this algorithm?

This will get boring soon enough, so I wrote this simple program to speed up the iterations. First try a low number of iterations. Then to see a better image do not hesitate to use 100,000 iterations.
Hint: when you've changed the numbers, simply press "Enter" on your keyboard to submit the numbers and recreate the image.

Also play around with the number of corners and the divider (the number that divides the dinstance between the corner and the current point).

See also the [Numberphile Youtube video](https://www.youtube.com/watch?v=kbKtFN71Lfs&list=PLt5AfwLFPxWLDKmnxLg8477hrxY33LL6q&index=22) .