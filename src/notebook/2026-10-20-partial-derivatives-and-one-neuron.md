---
title: "Part 7: Partial derivatives and one neuron"
date: 2026-10-20T10:07:00Z
kind: note
topic: calculus-for-ai
summary: When a function has many inputs, change one at a time and hold the rest still. That is enough to work out, by hand, how a neuron's error depends on its weight and bias.
---

## Functions of many inputs

In AI a function almost never has a single input. A network's loss depends on every one of its weights at once. Start with two inputs:

$$
z = x^2 + 3xy + y^2
$$

Think of $z$ as your height on a hillside, $x$ as how far east you are and $y$ as how far north. Face east and take a small step: how fast do you climb? Face north instead: how fast now? These are two different questions with two different answers, and each answer is a **partial derivative**.

The rule is short: **differentiate with respect to one variable, and treat every other variable as a constant.**

With respect to $x$, holding $y$ fixed:

$$
\frac{\partial z}{\partial x} = 2x + 3y + 0
$$

With $y$ frozen, the middle term $3xy$ is just the constant $3y$ times $x$, so its derivative is $3y$. The last term, $y^2$, doesn't involve $x$ at all, so it contributes 0.

With respect to $y$, holding $x$ fixed:

$$
\frac{\partial z}{\partial y} = 0 + 3x + 2y
$$

The curly $\partial$ is a reminder that other variables exist and are being held still.

The chain rule works exactly as before. For $z = (2x + 3y)^3$, the outer cube gives $3(2x + 3y)^2$, and the inside contributes 2 when you nudge $x$ and 3 when you nudge $y$:

$$
\begin{aligned}
\frac{\partial z}{\partial x} &= 6(2x + 3y)^2 \\[4pt]
\frac{\partial z}{\partial y} &= 9(2x + 3y)^2
\end{aligned}
$$

## One neuron, one example

The simplest model is a single neuron: it takes an input $x$, multiplies it by a weight $w$ and adds a bias $b$. Its error on one example whose correct answer is $y$ is

$$
L = (wx + b - y)^2
$$

During training, $x$ and $y$ come from the data, so they are fixed. The weight and the bias are what get adjusted. So we want the partial derivatives with respect to $w$ and $b$, and the chain rule gives them:

$$
\begin{aligned}
\frac{\partial L}{\partial w} &= 2\,(wx + b - y)\cdot x \\[4pt]
\frac{\partial L}{\partial b} &= 2\,(wx + b - y)\cdot 1
\end{aligned}
$$

Read them. $wx + b - y$ is the error, prediction minus target. The weight's gradient is the error times the input: a weight attached to a large input gets a large share of the blame, and a weight whose input was zero gets none, because it had no effect on this prediction. The bias always gets the error itself.

You can also ask how the loss depends on the input:

$$
\frac{\partial L}{\partial x} = 2\,(wx + b - y)\cdot w
$$

In a deep network, this is how the gradient travels back to the previous layer, whose output is this layer's input. It is also how *adversarial examples* are found: the gradient with respect to an image's pixels shows which tiny changes to the image would fool a classifier the most.[^1]

## The computational graph

Rather than differentiate one big formula, break the computation into named steps:

$$
u = wx + b \qquad L = (u - y)^2
$$

Each step has a small local derivative:

$$
\begin{aligned}
\frac{\partial L}{\partial u} &= 2(u - y) \\[4pt]
\frac{\partial u}{\partial w} &= x \\[4pt]
\frac{\partial u}{\partial b} &= 1
\end{aligned}
$$

and the chain rule joins them:

$$
\frac{\partial L}{\partial w} = \frac{\partial L}{\partial u}\cdot\frac{\partial u}{\partial w} = 2(u - y)\,x
$$

That is the same answer as before. No step needs to know about any other; each knows only its own small derivative, and the chain rule stitches them together. This picture, with values flowing forward through named steps and derivatives flowing back, is called a **computational graph**.

## A deeper chain, by hand

Add one more step:

$$
\begin{aligned}
u &= wx + b \\
v &= u^2 \\
L &= (v - y)^2
\end{aligned}
$$

The bias reaches the loss through a chain, $b \to u \to v \to L$, so

$$
\begin{aligned}
\frac{\partial L}{\partial b} &= \frac{\partial L}{\partial v}\,\frac{\partial v}{\partial u}\,\frac{\partial u}{\partial b} \\[4pt]
&= 2(v - y)\cdot 2u \cdot 1 \\[4pt]
&= 4u\,(v - y)
\end{aligned}
$$

Now put in numbers: the data are $x = 2$ and $y = 3$, and the starting guess is $w = 0.5$, $b = 0$.

**Forward pass**, computing values from the input to the loss:

| Step | Value |
|---|---:|
| $u = wx + b$ | 1 |
| $v = u^2$ | 1 |
| $L = (v - y)^2$ | 4 |

**Backward pass**, computing derivatives from the loss back to the parameters:

| Derivative | Computed as | Value |
|---|---|---:|
| $\partial L / \partial v$ | $2(v - y)$ | −4 |
| $\partial L / \partial u$ | $(-4) \cdot 2u$ | −8 |
| $\partial L / \partial b$ | $(-8) \cdot 1$ | −8 |
| $\partial L / \partial w$ | $(-8) \cdot x$ | −16 |

![The neuron as a computational graph, with values flowing forward and gradients flowing back](/assets/img/math/backprop-graph.svg "Figure 1. The same computation as a graph. Values flow forward to the loss; gradients start at the loss and flow back, each step multiplying by one local derivative.")

Notice that $\partial L / \partial u = -8$ was computed once and used twice, for both $b$ and $w$. In a network with millions of weights, that reuse is the whole trick. One backward pass produces every gradient, at a cost comparable to one forward pass. That is **backpropagation**.

Both gradients are negative, so increasing $w$ and $b$ will lower the loss. [Part 8](/notebook/the-gradient/) takes that step.

## What `loss.backward()` does

Deep-learning frameworks do exactly this. Here is the same neuron in PyTorch:

```python
import torch

x, y = 2.0, 3.0
w = torch.tensor(0.5, requires_grad=True)
b = torch.tensor(0.0, requires_grad=True)

# Forward pass: L = 4
u = w * x + b
v = u ** 2
L = (v - y) ** 2

# Backward pass: the chain rule,
# from L back to w and b
L.backward()
print(w.grad, b.grad)
# tensor(-16.) tensor(-8.)
```

The framework records each step of the forward computation as a graph, then walks it backwards multiplying local derivatives, just as in the table above. It uses no calculus beyond what you have just done by hand.

::: callout Hidden meaning
"Hold everything else fixed" is an assumption, not a fact. It judges each weight as if it acted alone, which is only true for tiny moves. In a real step every weight moves at once and their effects interact, which is one more reason steps must stay small. The neuron's gradient also shows the shape of learning: the update to a weight is the signal coming in times the error coming back. That has the same form as Hebb's rule, popularly "cells that fire together wire together", with the error taking the place of the second cell's activity.
:::

## Try it

1. For $z = 4x^2 + 5xy + 3y^2$, find $\partial z / \partial x$ and $\partial z / \partial y$.
2. For $z = x^2 y + 3xy^2 + 2y$, find both partial derivatives.
3. For $z = (x + y)^2$, find both partial derivatives without expanding.
4. With $u = wx + b$ and $v = u^2$, find $\partial v / \partial w$.
5. In the deeper chain, find $\partial L / \partial w$ as a formula, then check it against the table.

<details>
<summary>Answers</summary>

1. $8x + 5y$ and $5x + 6y$
2. $2xy + 3y^2$ and $x^2 + 6xy + 2$
3. Both are $2(x + y)$, because $x$ and $y$ each appear inside the bracket with coefficient 1.
4. $2u \cdot x = 2ux$
5. $2(v - y) \cdot 2u \cdot x = 4ux\,(v - y)$. With the numbers above, $4 \cdot 1 \cdot 2 \cdot (1 - 3) = -16$.

</details>

[^1]: Goodfellow, Shlens & Szegedy (2015), “Explaining and harnessing adversarial examples”, *ICLR*.
