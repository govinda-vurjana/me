---
title: "Part 9: Jacobians and Hessians"
date: 2026-10-20T10:09:00Z
kind: note
topic: calculus-for-ai
summary: The Jacobian is the derivative of a function with many outputs, which is what a network layer is. The Hessian is the second derivative of a function with many inputs, which is what shows the shape of the loss.
---

## When the output is a list too

The gradient handles many inputs and one output. A layer of a network has many inputs *and* many outputs. Take a function of $x$ and $y$ that produces two outputs:

$$
u = x^2 + y \qquad v = xy
$$

There are now four questions: how each output changes with each input. The **Jacobian** arranges the four answers in a grid, with one row per output and one column per input:

$$
J = \begin{bmatrix} \dfrac{\partial u}{\partial x} & \dfrac{\partial u}{\partial y} \\[10pt] \dfrac{\partial v}{\partial x} & \dfrac{\partial v}{\partial y} \end{bmatrix} = \begin{bmatrix} 2x & 1 \\ y & x \end{bmatrix}
$$

Each row is the gradient of one output. Each entry says: nudge this input, and this output moves at this rate.

![Inputs x and y each wired to outputs u and v, with the four rates collected in the Jacobian](/assets/img/math/jacobian-wiring.svg "Figure 1. Every input can move every output. The Jacobian lists the four rates: one row per output, one column per input. The first column is everything that nudging x does.")

The Jacobian does the job the ordinary derivative did in [Part 1](/notebook/what-a-derivative-measures/), where $\Delta f \approx f'(x)\,\Delta x$. Now it is a matrix times a vector:

$$
\begin{bmatrix} \Delta u \\ \Delta v \end{bmatrix} \approx J \begin{bmatrix} \Delta x \\ \Delta y \end{bmatrix}
$$

At the point $(2, 3)$ the Jacobian is $\begin{bmatrix} 4 & 1 \\ 3 & 2 \end{bmatrix}$. Nudge $x$ by $0.01$, and it predicts $\Delta u \approx 0.04$ and $\Delta v \approx 0.03$. Directly: $u$ goes from $7$ to $2.01^2 + 3 = 7.0401$, and $v$ goes from $6$ to $2.01 \cdot 3 = 6.03$.

For a linear function the Jacobian is simply its table of coefficients. For $u = 3x + y$ and $v = x + 2y$:

$$
J = \begin{bmatrix} 3 & 1 \\ 1 & 2 \end{bmatrix}
$$

## Jacobians are how gradients pass through layers

A layer of a neural network takes a vector and returns a vector, so its derivative is a Jacobian. For a linear layer $\mathbf{z} = W\mathbf{x}$, the Jacobian is the weight matrix $W$ itself, for the same reason as in the example just above.

Layers are chained, and the chain rule for vectors is the one from [Part 3](/notebook/the-chain-rule/), with matrices in place of numbers:

$$
J_{\text{network}} = J_3\,J_2\,J_1
$$

Backpropagation never builds this whole product. It starts with the gradient of the loss and multiplies it by one layer's Jacobian (transposed) at a time, from the last layer back to the first. The vanishing and exploding gradients of Part 3 are this product of matrices shrinking toward zero or growing without limit.

## The Hessian: curvature in every direction

For a function with many inputs and one output, such as a loss, the second derivative is a matrix too. The **Hessian** collects every second partial derivative:

$$
H = \begin{bmatrix} \dfrac{\partial^2 f}{\partial x^2} & \dfrac{\partial^2 f}{\partial x\,\partial y} \\[10pt] \dfrac{\partial^2 f}{\partial y\,\partial x} & \dfrac{\partial^2 f}{\partial y^2} \end{bmatrix}
$$

Take $f(x, y) = x^2 + 3xy + y^2$. Its first partial derivatives are $\partial f / \partial x = 2x + 3y$ and $\partial f / \partial y = 3x + 2y$. Differentiate each of those again, once with respect to $x$ and once with respect to $y$:

$$
H = \begin{bmatrix} 2 & 3 \\ 3 & 2 \end{bmatrix}
$$

Two things to notice. First, the off-diagonal entries are equal. For smooth functions they always are, because the order in which you take partial derivatives doesn't matter, so a Hessian is symmetric. Second, the Hessian is the Jacobian of the gradient: the gradient is itself a function with several outputs, and its Jacobian is $H$.

## What the Hessian sees that the gradient can't

At $(0, 0)$, the gradient of $f = x^2 + 3xy + y^2$ is $(0, 0)$, so the surface is flat there. Is it a minimum? Walk along two lines through the origin:

- along $y = x$: $f = x^2 + 3x^2 + x^2 = 5x^2$, which rises in both directions;
- along $y = -x$: $f = x^2 - 3x^2 + x^2 = -x^2$, which falls in both directions.

So the origin is a **saddle**: flat, but uphill one way and downhill another, like the middle of a horse's saddle. The gradient can't tell a saddle from a minimum, since it is zero at both. The Hessian can, because it holds the curvature in every direction. Along a direction $(a, b)$ the curvature is

$$
\frac{\partial^2 f}{\partial x^2}\,a^2 + 2\,\frac{\partial^2 f}{\partial x\,\partial y}\,ab + \frac{\partial^2 f}{\partial y^2}\,b^2
$$

For $(1, 1)$ that is $2 + 6 + 2 = 10$, and for $(1, -1)$ it is $2 - 6 + 2 = -2$: exactly the second derivatives of $5x^2$ and $-x^2$. Compare $x^2 + y^2$, whose Hessian is $\begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$. It curves upward in every direction: a true bowl.

![Contour maps of a bowl and a saddle, both flat at the centre](/assets/img/math/bowl-vs-saddle.svg "Figure 2. A bowl and a saddle seen from above. Both are flat at the centre, but the saddle rises along y = x and falls along y = −x.")

## Where this shows up in AI

**Saddle points.** A large network's loss is a surface over billions of dimensions. With so many directions, it is unlikely that every one of them curves upward at a flat point, and research on high-dimensional problems suggests most flat points are saddles rather than minima.[^1] Gradient descent slows down near a saddle, where the gradient is small, but the downhill directions usually let it escape.

**Step sizes.** [Part 6](/notebook/the-second-derivative/) showed that curvature caps the learning rate at $2 / L''$. With many weights, the Hessian holds the curvature in every direction, and the most sharply curved one sets the cap.

**Newton's method.** If you know the curvature, you can jump straight to the bottom of a bowl. In one dimension, Newton's step divides the slope by the curvature, $w \leftarrow w - L'(w) / L''(w)$. On the one-weight loss $L = (2w - 6)^2$ from the [topic page](/math/calculus-for-ai/), $L' = 8w - 24$ and $L'' = 8$, so from any starting $w$ a single Newton step lands exactly on $w = 3$, where gradient descent needed many. Why doesn't everyone use it? A model with a billion weights has a Hessian with a billion times a billion, $10^{18}$, entries. So training uses the gradient alone, and curvature is approximated cheaply or studied, rather than computed in full.

That takes the series from the slope of a single curve to the curvature of a whole landscape.

## Try it

1. The Jacobian of $u = 3x + y$, $v = x + 2y$.
2. The Jacobian of $u = x^2 + y$, $v = xy + y^2$.
3. The Jacobian of $u = x^2 + 3y$, $v = 2xy + y^2$.
4. The Hessian of $f(x, y) = x^2 + 4y^2$. What does it say about the contours in the figure in [Part 8](/notebook/the-gradient/)?

<details>
<summary>Answers</summary>

1. $\begin{bmatrix} 3 & 1 \\ 1 & 2 \end{bmatrix}$
2. $\begin{bmatrix} 2x & 1 \\ y & x + 2y \end{bmatrix}$. The easy slip is the last entry: differentiating $xy$ with respect to $y$ leaves $x$, so it is $x + 2y$, not $2y$.
3. $\begin{bmatrix} 2x & 3 \\ 2y & 2x + 2y \end{bmatrix}$
4. $\begin{bmatrix} 2 & 0 \\ 0 & 8 \end{bmatrix}$. It curves upward in every direction, so the origin is a minimum, and it curves four times as sharply in $y$ as in $x$. That is why the contours are squeezed in the $y$ direction.

</details>

[^1]: Dauphin et al. (2014), “Identifying and attacking the saddle point problem in high-dimensional non-convex optimization”, *NeurIPS*.
