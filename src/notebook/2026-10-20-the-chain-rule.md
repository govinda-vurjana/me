---
title: "Part 3: The chain rule"
date: 2026-10-20T10:03:00Z
kind: note
topic: calculus-for-ai
summary: When one function sits inside another, their rates of change multiply. This one rule, applied over and over, is backpropagation.
---

## Functions inside functions

Look at

$$
y = (3x + 2)^5
$$

Two things happen in order. First $x$ is turned into $u = 3x + 2$. Then $u$ is raised to the fifth power, $y = u^5$. Draw it as a chain:

$$
x \;\longrightarrow\; u \;\longrightarrow\; y
$$

$x$ never acts on $y$ directly. It moves $u$, and $u$ moves $y$.

## Multiply the rates

Each link in the chain has its own rate of change:

- $\dfrac{du}{dx} = 3$. Every unit of change in $x$ moves $u$ by 3.
- $\dfrac{dy}{du} = 5u^4$. At $u = 2$ this is $5 \cdot 2^4 = 80$, so a small change in $u$ moves $y$ about 80 times as much.

Pass a small nudge along the chain. It is multiplied by 3 at the first link and by 80 at the second, so it arrives multiplied by 240. Gears work the same way: if the first gear turns the second three times per turn, and the second turns the third eighty times per turn, then the first turns the third 240 times.

![The chain x to u to y with rates 3 and 80](/assets/img/math/chain-rule.svg "Figure 1. A nudge of 0.001 in x becomes 0.003 in u, then about 0.240 in y. The rates multiply.")

That is the chain rule:

$$
\boxed{\frac{dy}{dx} = \frac{dy}{du}\cdot\frac{du}{dx}}
$$

::: callout Key idea
When functions are chained, their rates of change multiply.
:::

For this example:

$$
\frac{dy}{dx} = 5u^4 \cdot 3 = 15\,(3x + 2)^4
$$

Check it with numbers. At $x = 0$, $u = 2$ and $y = 32$, and the formula predicts a slope of $15 \cdot 2^4 = 240$. Nudge $x$ to $0.001$: then $u = 2.003$ and $y = 2.003^5 \approx 32.2407$. The output rose by about $0.2407$, which is $240 \times 0.001$.

A note on the notation. In $\dfrac{du}{dx}$, the bottom is what you nudge and the top is what you watch. So $\dfrac{du}{dx}$ means "nudge $x$, watch $u$", and $\dfrac{dy}{du}$ means "nudge $u$, watch $y$". Written this way the chain rule looks like fractions cancelling. They don't literally cancel, but the notation was designed so that you can treat them as if they do, which makes the rule hard to get wrong.

## Longer chains

Nothing limits a chain to two links. For $y = (x^2 + 3)^4$, name every step:

$$
x \to v = x^2 \to u = v + 3 \to y = u^4
$$

and multiply all the rates:

$$
\begin{aligned}
\frac{dy}{dx} &= \frac{dy}{du}\cdot\frac{du}{dv}\cdot\frac{dv}{dx} \\
&= 4u^3 \cdot 1 \cdot 2x = 8x\,(x^2 + 3)^3
\end{aligned}
$$

Naming the intermediate steps is not a crutch for beginners. It is exactly how software that computes derivatives works, as [Part 7](/notebook/partial-derivatives-and-one-neuron/) shows.

## A recipe

1. Find the outermost operation.
2. Differentiate it, leaving whatever is inside untouched.
3. Multiply by the derivative of the inside.
4. If the inside has an inside of its own, repeat.

The most common mistake is in step 2. Differentiating $(2x + 5)^4$, the power drops by one; it does not disappear:

$$
\begin{aligned}
\frac{d}{dx}(2x + 5)^4 &= 4\,(2x + 5)^3 \cdot 2 \\
&= 8\,(2x + 5)^3
\end{aligned}
$$

and not $8\,(2x + 5)$.

## Combined with the other rules

Product and chain: $y = x^2(3x + 1)^5$ is a product, and its second factor needs the chain rule.

$$
y' = 2x(3x + 1)^5 + 15x^2(3x + 1)^4
$$

Quotient and chain: for $y = \dfrac{(2x + 1)^3}{x^2 + 1}$, the top needs the chain rule, $\dfrac{d}{dx}(2x + 1)^3 = 6(2x + 1)^2$, and the bottom's derivative is $2x$. So the top of the quotient rule is $6(2x + 1)^2(x^2 + 1) - 2x(2x + 1)^3$. Take out the common factor $(2x + 1)^2$ and it simplifies to

$$
y' = \frac{2(2x + 1)^2(x^2 - x + 3)}{(x^2 + 1)^2}
$$

## Why this is the most important rule in AI

A neural network is a long chain of functions. The input $x$ passes through layer after layer, each producing an output $a_1, a_2, a_3$, and the last output feeds the loss $L$:

$$
x \to a_1 \to a_2 \to a_3 \to L
$$

To train a weight $w$ in the first layer you need the derivative of the loss with respect to $w$, and that weight affects the loss only through every layer after it. The chain rule says what to do: multiply the local rates along the path.

$$
\frac{\partial L}{\partial w} = \frac{\partial L}{\partial a_3}\cdot\frac{\partial a_3}{\partial a_2}\cdot\frac{\partial a_2}{\partial a_1}\cdot\frac{\partial a_1}{\partial w}
$$

The curly $\partial$ is used when a function has more than one input, which [Part 7](/notebook/partial-derivatives-and-one-neuron/) explains. For now, read it as $d$.

**Backpropagation** is this product computed backwards from the loss, so that the shared part of the product is worked out once and reused for every weight before it. It is the chain rule, organised.

The same product explains a famous problem. If each local rate in a 20-layer chain is about $0.5$, the product is $0.5^{20} \approx 0.000001$: the gradient *vanishes*, and the early layers barely learn. If each rate is about $1.5$, the product is $1.5^{20} \approx 3300$, and the gradient *explodes*.[^1] Much of modern network design, including residual connections, the gates of an LSTM and careful weight initialisation, exists to keep that product close to 1.

![Products of 20 local rates on a log scale: 1.5 per layer explodes, 0.5 per layer vanishes](/assets/img/math/vanishing-gradients.svg "Figure 2. The product of the local rates as a gradient passes back through 20 layers, on a log scale. At 0.5 per layer it falls to about one millionth; at 1.5 it grows to about 3300.")

## Try it

1. $(2x + 1)^3$
2. $(x^2 + 3)^4$
3. $(x^2 + 1)^3$
4. $x^3(2x + 5)^4$
5. $\dfrac{(2x + 1)^3}{x^2 + 1}$
6. $\sqrt{1 + x^2}$

<details>
<summary>Answers</summary>

1. $3(2x + 1)^2 \cdot 2 = 6(2x + 1)^2$
2. $4(x^2 + 3)^3 \cdot 2x = 8x(x^2 + 3)^3$
3. $3(x^2 + 1)^2 \cdot 2x = 6x(x^2 + 1)^2$
4. $3x^2(2x + 5)^4 + x^3 \cdot 8(2x + 5)^3$
5. The top is $6(2x + 1)^2(x^2 + 1) - 2x(2x + 1)^3$ and the bottom is $(x^2 + 1)^2$. Simplified: $\dfrac{2(2x + 1)^2(x^2 - x + 3)}{(x^2 + 1)^2}$.
6. Write it as $(1 + x^2)^{1/2}$. Then $\tfrac12(1 + x^2)^{-1/2} \cdot 2x = \dfrac{x}{\sqrt{1 + x^2}}$.

</details>

[^1]: Bengio, Simard & Frasconi (1994), “Learning long-term dependencies with gradient descent is difficult”, *IEEE Transactions on Neural Networks*, 5(2).
