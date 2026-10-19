---
title: "Part 5: Implicit differentiation"
date: 2026-10-20T10:05:00Z
kind: note
topic: calculus-for-ai
summary: Sometimes y can't be written on its own. You can still find its slope by remembering that y depends on x, which turns every y-term into a small chain rule.
---

## When $y$ won't stand alone

So far every function came as $y = f(x)$. Sometimes $x$ and $y$ are mixed together:

$$
x^2 + y^2 = 25
$$

That is a circle of radius 5. You could solve for $y = \pm\sqrt{25 - x^2}$ and differentiate, but it is clumsy, and for many equations solving for $y$ is impossible. Implicit differentiation skips that step: differentiate both sides of the equation as they stand.

## The one idea: $y$ depends on $x$

Even when it isn't written as $y = f(x)$, $y$ is still a function of $x$. Move along the circle and $y$ changes as $x$ does. So any term containing $y$ hides a chain:

$$
x \;\longrightarrow\; y \;\longrightarrow\; y^2
$$

Differentiating $y^2$ with respect to $x$ takes two steps:

1. $x$ changes, and $y$ changes with it, at rate $\dfrac{dy}{dx}$.
2. $y$ changes, and $y^2$ changes with it, at rate $2y$.

Multiply the rates, as in [Part 3](/notebook/the-chain-rule/):

$$
\frac{d}{dx}\,y^2 = 2y\,\frac{dy}{dx}
$$

With numbers: suppose that at some point $\dfrac{dy}{dx} = 3$ and $y = 2$. A small change in $x$ makes $y$ change 3 times as much, and that makes $y^2$ change $2y = 4$ times as much again. Overall, $y^2$ changes 12 times as fast as $x$.

Compare the two questions. The first nudges $y$ itself; the second nudges $x$, which then moves $y$:

$$
\begin{aligned}
\frac{d}{dy}\,y^2 &= 2y \\[4pt]
\frac{d}{dx}\,y^2 &= 2y\,\frac{dy}{dx}
\end{aligned}
$$

The extra $\dfrac{dy}{dx}$ is the cost of going through $y$. Every $y$-term carries one.

## The circle

Differentiate both sides of $x^2 + y^2 = 25$ with respect to $x$. The right side is a constant, so its derivative is 0:

$$
2x + 2y\,\frac{dy}{dx} = 0 \quad\Rightarrow\quad \frac{dy}{dx} = -\frac{x}{y}
$$

Check it at the point $(3, 4)$, where the slope is $-\tfrac34$. The radius from the centre to $(3, 4)$ has slope $\tfrac43$, and a tangent to a circle is perpendicular to its radius. Perpendicular slopes multiply to $-1$, and indeed $-\tfrac34 \times \tfrac43 = -1$. At the top of the circle, $(0, 5)$, the slope is $0$: flat, as it should be.

![The circle of radius 5 with the radius and tangent at the point (3, 4)](/assets/img/math/circle-tangent.svg "Figure 1. The tangent at (3, 4) has slope −3/4, at right angles to the radius, whose slope is 4/3. Implicit differentiation found it without ever solving for y.")

## With a product

For $x^2 + xy + y^2 = 7$, the middle term is a product of two things that both change with $x$, so it needs the product rule:

$$
\frac{d}{dx}(xy) = 1 \cdot y + x\,\frac{dy}{dx}
$$

Differentiate every term:

$$
2x + y + x\,\frac{dy}{dx} + 2y\,\frac{dy}{dx} = 0
$$

Collect the $\dfrac{dy}{dx}$ terms:

$$
\frac{dy}{dx}\,(x + 2y) = -(2x + y)
$$

and solve:

$$
\frac{dy}{dx} = -\frac{2x + y}{x + 2y}
$$

This is also the move that appeared on the left-hand side in [Part 4](/notebook/exponentials-logarithms-and-sines/), where $\ln y$ became $\tfrac{1}{y}\,\tfrac{dy}{dx}$.

## Where this shows up in AI

Some models define their output by an equation it has to satisfy rather than by a formula. A *deep equilibrium model* applies the same layer over and over until the output stops changing, reaching a fixed point $z = f(z, x)$.[^1] Training it needs the derivative of $z$ with respect to the input and the weights, yet $z$ is never written as a formula. Implicit differentiation of $z = f(z, x)$ gives that derivative directly, without storing the many steps it took to reach the fixed point. The same technique gives gradients through an optimisation problem solved inside a model.

Fixed points matter for memory too. An associative memory such as a Hopfield network recalls a stored pattern by settling into a fixed point from a partial cue.

::: callout Hidden meaning
Some answers are defined by a condition rather than a recipe: *the state where the system stops changing*. Implicit differentiation says you can work out how such an answer moves when its inputs move without knowing, or storing, how the system got there. For memory this matters: a network that recalls by settling into a fixed point can be trained through that fixed point directly, an idea that goes back to recurrent backpropagation in the 1980s.[^2]
:::

## Try it

1. Find $\dfrac{d}{dx}\,y^3$.
2. For $x^2 + y^2 = 25$, find the slope at $(-4, 3)$.
3. For $x^2 + xy + y^2 = 7$, find the slope at the point $(1, 2)$.

<details>
<summary>Answers</summary>

1. $3y^2\,\dfrac{dy}{dx}$
2. $-\dfrac{x}{y} = -\dfrac{-4}{3} = \dfrac43$
3. $-\dfrac{2 \cdot 1 + 2}{1 + 2 \cdot 2} = -\dfrac45$. The point is on the curve, since $1 + 2 + 4 = 7$.

</details>

[^1]: Bai, Kolter & Koltun (2019), “Deep equilibrium models”, *NeurIPS*.
[^2]: Pineda (1987), “Generalization of back-propagation to recurrent neural networks”, *Physical Review Letters*, 59(19); Almeida (1987), “A learning rule for asynchronous perceptrons with feedback in a combinatorial environment”, *IEEE First International Conference on Neural Networks*.
