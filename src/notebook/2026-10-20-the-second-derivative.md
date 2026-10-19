---
title: "Part 6: The second derivative"
date: 2026-10-20T10:06:00Z
kind: note
topic: calculus-for-ai
summary: The derivative of the derivative says how the slope itself is changing. It describes the shape of a curve, and in training it decides how large a step is safe.
---

## The rate of change of the rate of change

The first derivative says how fast a function is changing. Differentiate again and you learn how fast *that* is changing:

$$
y = x^3 \;\to\; y' = 3x^2 \;\to\; y'' = 6x
$$

The second derivative is written $y''$ or $\dfrac{d^2 y}{dx^2}$. If $y$ is the position of a car, $y'$ is its speed and $y''$ is its acceleration: how hard it is speeding up or braking.

It is usually described in terms of slope because $y'$ *is* the slope of the curve at each point, so $y''$ is the rate at which the slope changes as you move along. For $y = x^3$ the slope is $3$ at $x = 1$ and $12$ at $x = 2$, and $y'' = 6x$ measures how quickly it climbs between them.

## What it says about shape

- $y'' > 0$: the slope is increasing, and the curve bends upward like a cup.
- $y'' < 0$: the slope is decreasing, and the curve bends downward like a cap.

This settles what kind of flat point you are at. Where $y' = 0$:

- if $y'' > 0$, you are at the bottom of a cup, a **minimum**;
- if $y'' < 0$, you are at the top of a cap, a **maximum**;
- if $y'' = 0$, the second derivative can't tell. For $y = x^3$ at $x = 0$, both derivatives are zero and the point is neither: the curve flattens for a moment, then keeps rising.

![A cup, a cap and the curve x cubed, each with a flat tangent at its centre](/assets/img/math/curvature-shapes.svg "Figure 1. Three flat points. The second derivative tells them apart: a cup is a minimum, a cap is a maximum, and x³ is neither.")

## Second derivatives use every rule

For $y = e^{x^2}$, the chain rule gives $y' = 2x\,e^{x^2}$. That is a product, so the second derivative needs the product rule and the chain rule again:

$$
\begin{aligned}
y'' &= 2\,e^{x^2} + 2x \cdot 2x\,e^{x^2} \\
&= (2 + 4x^2)\,e^{x^2}
\end{aligned}
$$

## Where this shows up in AI: how big a step is safe

Training moves a weight against the slope of the loss:

$$
w \;\leftarrow\; w - \eta\,L'(w)
$$

Here $\eta$ (eta) is the learning rate, the size of the step. How large can it be? That depends on the curvature, $L''$.

Take the simplest bowl, $L(w) = \tfrac{a}{2}\,w^2$. Its slope is $L' = aw$ and its curvature is $L'' = a$. One step gives

$$
w \;\leftarrow\; w - \eta a w = (1 - \eta a)\,w
$$

so every step multiplies $w$ by $1 - \eta a$. Three things can happen:

- $\eta a < 1$: $w$ shrinks steadily toward the minimum at 0.
- $1 < \eta a < 2$: each step overshoots to the other side, but lands closer, so it still settles.
- $\eta a > 2$: each step lands farther out than the last, and training *diverges*.

![Gradient descent on a parabola with three step sizes](/assets/img/math/step-size.svg "Figure 2. Gradient descent on L = w² with three step sizes. Each step multiplies w by (1 − ηL''). Below 1 it settles smoothly, between 1 and 2 it zig-zags in, above 2 it flies off.")

So a sharply curved loss demands a small learning rate: $\eta$ has to stay below $2 / L''$. In the [one-weight example](/math/calculus-for-ai/) on the topic page, $L'' = 8$, so any learning rate above $0.25$ would have made $w$ swing wider at every step. In a real network the curvature is different in every direction ([Part 9](/notebook/jacobians-and-hessians/)), and the most sharply curved direction sets the limit. This is why a learning rate that is too high makes the loss blow up instead of fall.

## Try it

1. For $y = x^4$, find $y'$ and $y''$.
2. For $y = x^3 - 3x$, find the flat points and say whether each is a minimum or a maximum.
3. For $L(w) = 5w^2$, what is the largest learning rate that does not diverge?

<details>
<summary>Answers</summary>

1. $y' = 4x^3$ and $y'' = 12x^2$.
2. $y' = 3x^2 - 3 = 0$ at $x = \pm 1$, and $y'' = 6x$. At $x = 1$, $y'' = 6 > 0$: a minimum. At $x = -1$, $y'' = -6 < 0$: a maximum.
3. $L'' = 10$, so $\eta$ must stay below $2/10 = 0.2$.

</details>
