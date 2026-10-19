---
title: "Part 8: The gradient, and which way is downhill"
date: 2026-10-20T10:08:00Z
kind: note
topic: calculus-for-ai
summary: Collect a function's partial derivatives into one arrow and it points straight uphill. Step the other way and you have gradient descent, the update at the heart of training.
---

## All the partial derivatives in one arrow

The **gradient** of a function collects its partial derivatives into a vector. It is written $\nabla f$, read "grad $f$".

$$
z = x^2 + y^2 \quad\Rightarrow\quad \nabla z = \begin{bmatrix} 2x \\ 2y \end{bmatrix}
$$

For $z = 3x^2 + 2xy + y^2$:

$$
\nabla z = \begin{bmatrix} 6x + 2y \\ 2x + 2y \end{bmatrix}
$$

and at the point $(1, 2)$:

$$
\nabla z(1, 2) = \begin{bmatrix} 10 \\ 6 \end{bmatrix}
$$

There, $z$ rises at rate 10 if you step in $x$, and at rate 6 if you step in $y$.

The gradient is an arrow you can draw at every point. Two properties make it useful: it points in the direction of steepest climb, and its length is how steep that climb is. The rest of this part shows why.

![Contour lines of x² + 4y² with gradient arrows and a gradient-descent path](/assets/img/math/gradient-contours.svg "Figure 1. Contours of f = x² + 4y² with gradient arrows (2x, 8y). The arrows cross the contours at right angles and are longest where the contours are closest together. The highlighted path is gradient descent.")

## Climbing in any direction

A partial derivative measures the slope along one of the axes. The **directional derivative** measures it in any direction you choose. If $\mathbf{u}$ is a vector of length 1 pointing that way,

$$
D_{\mathbf{u}} f = \nabla f \cdot \mathbf{u}
$$

The dot is the dot product: multiply matching components and add them, $(a, b) \cdot (c, d) = ac + bd$.

With $\nabla f = (2, 8)$:

- East, $\mathbf{u} = (1, 0)$: $2 \cdot 1 + 8 \cdot 0 = 2$, which is just $\partial f / \partial x$.
- North, $\mathbf{u} = (0, 1)$: $2 \cdot 0 + 8 \cdot 1 = 8$, which is $\partial f / \partial y$.

## Why the direction must have length 1

The directional derivative is meant to be *climb per unit of distance*. A longer direction vector would inflate the answer just by being longer, so it is first scaled to length 1, a **unit vector**.

The vector $(1, 1)$ means one step right and one step up. Those two steps form a right-angled triangle, and the diagonal is longer than either side: by Pythagoras its length is $\sqrt{1^2 + 1^2} = \sqrt2 \approx 1.414$. Divide by that length to get a unit vector pointing the same way:

$$
\hat{\mathbf{u}} = \left(\tfrac{1}{\sqrt2}, \tfrac{1}{\sqrt2}\right)
$$

With $\nabla f = (2, 8)$ again, the directional derivative along it is

$$
D_{\hat{\mathbf{u}}} f = \frac{2 + 8}{\sqrt2} = 5\sqrt2 \approx 7.07
$$

A worked example: $f(x, y) = x^2 + 4y^2$ at the point $(1, 1)$, in the direction of $(3, 4)$.

1. The gradient is $\nabla f = (2x, 8y)$, so $\nabla f(1, 1) = (2, 8)$.
2. The length of $(3, 4)$ is $\sqrt{9 + 16} = 5$, so the unit vector is $(0.6, 0.8)$.
3. The dot product is $2 \cdot 0.6 + 8 \cdot 0.8 = 1.2 + 6.4 = 7.6$.

## Why the gradient points uphill

The dot product of two arrows also equals their lengths multiplied together, times the cosine of the angle $\theta$ between them. With a unit vector that gives

$$
D_{\hat{\mathbf{u}}} f = \lVert \nabla f \rVert \cos\theta
$$

- It is largest when $\theta = 0$, that is, when you walk along the gradient. The rate of climb there is the gradient's length, $\lVert \nabla f \rVert$.
- It is zero when you walk at right angles to the gradient, along a contour line where the height doesn't change. That is why the arrows in the figure cross the contours at right angles.
- It is most negative when you walk exactly against the gradient. **$-\nabla f$ is the direction of steepest descent.**

In the worked example, $\lVert \nabla f \rVert = \sqrt{2^2 + 8^2} = \sqrt{68} \approx 8.25$. No direction climbs faster: north managed 8, and the $(3, 4)$ direction 7.6.

## Gradient descent

To make a loss smaller, step against its gradient:

$$
\mathbf{w} \;\leftarrow\; \mathbf{w} - \eta\,\nabla L(\mathbf{w})
$$

Every weight moves a little, each in proportion to its own partial derivative. The learning rate $\eta$ sets the size of the step, and [Part 6](/notebook/the-second-derivative/) showed why it can't be too large.

Back to the neuron from [Part 7](/notebook/partial-derivatives-and-one-neuron/). At $w = 0.5$, $b = 0$ its loss was 4 and its gradient was $(\partial L / \partial w, \partial L / \partial b) = (-16, -8)$. Take one step with $\eta = 0.01$:

$$
\begin{aligned}
w &= 0.5 - 0.01 \cdot (-16) = 0.66 \\
b &= 0 - 0.01 \cdot (-8) = 0.08
\end{aligned}
$$

Run the forward pass again: $u = 0.66 \cdot 2 + 0.08 = 1.40$, then $v = 1.96$, then $L = (1.96 - 3)^2 \approx 1.08$. One step cut the loss from 4 to about 1.08.

That is one step of training, and every neural network trains with steps of this shape: a forward pass to get the loss, a backward pass to get the gradient, and a small move downhill. Real training estimates the gradient from a random batch of examples rather than the whole dataset, which is *stochastic* gradient descent, and optimisers such as Adam adjust the step for each weight separately. But all of them start from the gradient. In a large model the gradient has billions of entries, and it is still just a list of partial derivatives.

::: callout Hidden meaning
The gradient is the only direction the loss cares about right now. A step along a contour changes nothing, so a gradient step spends all of its length where it counts. It is also local and greedy: it knows which way is down from *here*, and nothing about where the deepest valley is. Everything a network learns is the accumulated result of these short-sighted steps, each one decided by the training examples voting together.
:::

## Try it

1. Find $\nabla z$ for $z = x^2 + 4y^2$.
2. For $z = 3x^2 + 2xy + y^2$, evaluate $\nabla z$ at $(1, 2)$.
3. With $\nabla f = (2, 8)$, find the directional derivative in the direction $(0, 1)$.
4. With $\nabla f = (3, 4)$, what is the fastest possible rate of climb, and in which direction?

<details>
<summary>Answers</summary>

1. $(2x, 8y)$
2. $(10, 6)$
3. $8$
4. $\lVert(3, 4)\rVert = 5$, in the direction $(0.6, 0.8)$, along the gradient itself.

</details>
