### Procedure
This experiment is about finding the primitive vectors for a given lattice. In theory, a lattice is infinite, but here we have a finite lattice. For a finite lattice with $N$ sites, the Bravais lattice definition is changed slightly as
$$R = n_{1}a_{1} + n_{2}a_{2} + n_{3}a_{3}$$
where $0 \leq n_{1} < N_{1}$, $0 \leq n_{2} < N_{2}$, $0 \leq n_{3} < N_{3}$ and $N = N_{1}N_{2}N_{3}$
<br>
The experiment contains 6 lattices which are square, rectangular, simple cubic, body centered cubic, face centered cubic and honeycomb lattice. The first two lattices are planar lattices, meaning they only extend in two dimensions. It is to be noted that the number of primitive vectors $d$ is equal to the number of dimensions of the lattice and hence the first two lattices have **only two** primitve vectors.
<br>
#### Finding primitive vectors
Primtive vectors can usually be found with ease for simple lattices, usually the vectors being the coordinate axes themselves. For the more complex lattices, viewing the vectors as translations will give a more clear picture. The vectors picked should encorporate lattice points in all directions from the origin. Satisying this condition alone helps identify the primtive vectors for the most part. Once the directions have been set, find the unit distance between lattice points in that direction by finding the closest lattice point in that direction. The vector now so obtained is the primitive vector that is required. 
<br> <br>
The steps to the experiment are given below
- The interface will contain a canvas in which the different finite lattices in question are shown.
- The interface contains buttons to move to next/previous lattice, a button to select atoms (which is a toggle switch) and a button to check the choice made.
- Usually, a lattice point is chosen to be the origin of these primitve vectors and the vectors are drawn out from there. But in this experiment, such a concept does not exist.
- It is expected that atoms are selected sequentially as head and tail of primitive vectors of the lattice and that all atoms are **unique**. It is expected that different atoms which have similar surroundings to the so called origin lattice point is chosen and then a corresponding lattice point is chosen which together creates one primitve vector.
- Even though the vectors obtained do not have a common origin, they are brought to a common origin during evaluation of the selection, retaining the validity of the selection if the magnitudes and directions of the vectors obtained are correct.
- It is required that not only the direction of the vectors chosen are right but also their magnitudes. Once the atoms are picked in the above mentioned order, the validness of the selection can be tested.
<br>
The last lattice, the honeycomb lattice is a counter case to the Bravais lattice definition. It has been proven that the honeycomb lattice is **not** a Bravais lattice. Since there is no right combination of atoms that will give the primitve vectors, it can never be a Bravais lattice. It is left as an exercise for the user to prove why it is impossible to adhere to the Bravais lattice definition for the case of a honeycomb lattice.

#### Note
Some lattices have been showed with an atom radius that is smaller than the mathematically proven one to help with the visibility of the lattice points to the user.
