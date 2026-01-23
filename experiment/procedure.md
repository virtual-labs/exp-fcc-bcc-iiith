## Procedure
This experiment is about finding the primitive vectors for a given lattice. In theory, a lattice is infinite, but here we have a finite lattice. For a finite lattice with $N$ sites, the Bravais lattice definition is changed slightly as
$$R = n_{1}a_{1} + n_{2}a_{2} + n_{3}a_{3}$$
where $0 \leq n_{1} < N_{1}$, $0 \leq n_{2} < N_{2}$, $0 \leq n_{3} < N_{3}$ and $N = N_{1}N_{2}N_{3}$
<br>
The experiment contains 6 lattices which are square, rectangular, simple cubic, body centered cubic, face centered cubic and honeycomb lattice. The first two lattices are planar lattices, meaning they only extend in two dimensions. It is to be noted that the number of primitive vectors $d$ is equal to the number of dimensions of the lattice and hence the first two lattices have **only two** primitive vectors.
<br>
### Finding Primitive Vectors
Primitive vectors define the repeating unit of a lattice in all dimensions. For simple lattices, these vectors often align with the coordinate axes. For more complex lattices, the following guidelines apply:
- **View Primitive Vectors as Translations**: Primitive vectors should allow translation to all lattice points in space.
- **Choose Appropriate Directions**: Select directions that include lattice points in all required dimensions.
- **Measure Unit Distances**: Identify the nearest lattice point in the chosen direction to determine the magnitude of the vector.
The vectors obtained through this process are the primitive vectors of the lattice.
<br> <br>
### Steps to Perform the Experiment 
- Explore the interface
  - The interface features a canvas displaying finite lattices.
  - Use the dropdown to select a lattice.
- Tools Provided:
  - Select Mode: Use left-click to select lattice points and right-click to deselect lattice points.
  - Clear Button: Reset all your selections.
  - Check Button: Evaluate the correctness of your selected primitive vectors.
- Make selections:
  - Select lattice points sequentially as the head and tail of primitive vectors.
  - A single lattice point can serve as the common tail for multiple vectors.
- Evaluate Vectors
  - Primitive vectors must originate from a common origin.
  - During evaluation, vectors are adjusted to a common origin if needed. Their directions and magnitudes are used to validate the selection. 
<br>
The last lattice, the honeycomb lattice is a counter case to the Bravais lattice definition. It has been proven that the honeycomb lattice is **not** a Bravais lattice. Since there is no right combination of atoms that will give the primitive vectors, it can never be a Bravais lattice. It is left as an exercise for the user to prove why it is impossible to adhere to the Bravais lattice definition for the case of a honeycomb lattice.

#### Note
To improve visibility, some lattices display lattice points with smaller radii than the actual values. This adjustment is intended to make selection easier for the user.
