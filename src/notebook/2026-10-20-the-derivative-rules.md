---
title: "Part 2: The derivative rules, and why they work"
date: 2026-10-20T10:02:00Z
kind: note
topic: calculus-for-ai
summary: A handful of rules cover most of what you need to differentiate by hand. Each one has a reason, and the reasons are easier to keep than the formulas.
---

Working from the definition every time would be slow. A few rules do the same job in a line, and each one follows from the definition in [Part 1](/notebook/what-a-derivative-measures/).

## Constants, multiples and sums

$$
\frac{d}{dx}\,c = 0
$$

$$
\frac{d}{dx}\big[a\,f(x)\big] = a\,f'(x)
$$

$$
\frac{d}{dx}\big[f(x) \pm g(x)\big] = f'(x) \pm g'(x)
$$

- A constant never changes, so its rate of change is zero. Its graph is a flat line.
- Stretching a graph vertically by $a$ stretches every slope by $a$.
- When two quantities are added, their rates add. Two taps filling one tank fill it at the sum of their rates.

## The power rule

$$
\frac{d}{dx}\,x^n = n\,x^{n-1}
$$

You saw $n = 2$ in Part 1. For any whole number $n$, expanding $(x+h)^n$ gives $x^n + n x^{n-1} h$ plus terms containing $h^2$ or higher powers of $h$. Subtract $x^n$, divide by $h$, let $h \to 0$, and only $n x^{n-1}$ survives.

The rule also works for negative and fractional powers, which makes it more useful than it looks. Rewrite fractions and roots as powers first:

$$
\begin{aligned}
\frac{d}{dx}\,\frac{1}{x^2} &= \frac{d}{dx}\,x^{-2} \\
&= -2x^{-3} = -\frac{2}{x^3}
\end{aligned}
$$

$$
\begin{aligned}
\frac{d}{dx}\,\sqrt{x} &= \frac{d}{dx}\,x^{1/2} \\
&= \tfrac12\,x^{-1/2} = \frac{1}{2\sqrt{x}}
\end{aligned}
$$

With the first three rules, a polynomial is differentiated term by term:

$$
\frac{d}{dx}\big(8x^7 - 4x^3 + 9\big) = 56x^6 - 12x^2
$$

## The product rule

$$
(fg)' = f'g + fg'
$$

When two functions are multiplied, both are changing at once. Picture $f \cdot g$ as the area of a rectangle with sides $f$ and $g$. Nudge $x$, and the width grows by $\Delta f$ while the height grows by $\Delta g$.

![A rectangle of area f times g growing by two strips and a small corner](/assets/img/math/product-rule-area.svg "Figure 1. The product f·g as an area. When x moves, the area grows by two strips, g·Δf and f·Δg, plus a corner ΔfΔg.")

The new area gains a strip $g\,\Delta f$ down one side, a strip $f\,\Delta g$ along the top, and a small corner $\Delta f\,\Delta g$. Divide by $\Delta x$ and let it shrink. The strips become $f'g$ and $fg'$, and the corner, a tiny quantity times another tiny quantity, disappears. That is the whole rule. It also shows why the answer is not simply $f'g'$: each factor's change is scaled by the *size* of the other factor.

Example: $y = x^2(x^3 + 1)$, with $f = x^2$ and $g = x^3 + 1$:

$$
\begin{aligned}
y' &= (2x)(x^3 + 1) + (x^2)(3x^2) \\
&= 5x^4 + 2x
\end{aligned}
$$

Check by multiplying out first: $y = x^5 + x^2$, so $y' = 5x^4 + 2x$. Same answer.

## The quotient rule

$$
\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}
$$

In words: *bottom times derivative of top, minus top times derivative of bottom, all over bottom squared*. The minus sign has a reason. Raising the top raises the fraction; raising the bottom lowers it.

Example:

$$
\begin{aligned}
\frac{d}{dx}\,\frac{x^2}{x + 1} &= \frac{(2x)(x + 1) - (x^2)(1)}{(x + 1)^2} \\[4pt]
&= \frac{x^2 + 2x}{(x + 1)^2}
\end{aligned}
$$

The quotient rule isn't really new. Writing $f/g$ as $f \cdot g^{-1}$ turns it into the product rule and the power rule, joined by the chain rule from [Part 3](/notebook/the-chain-rule/).

## Where this shows up in AI

Loss functions are assembled from exactly these pieces.

- The squared error $(\hat y - y)^2$ is a power. A weight penalty such as $\lambda w^2$ is a constant times a power.
- The loss on a batch of examples is the average of the loss on each one, so its derivative is the average of their derivatives. That is why a network can learn from a whole batch at once: the batch's gradient is just the average of each example's gradient.
- Products appear wherever two quantities that both depend on the weights are multiplied, such as a gate multiplying a signal inside an LSTM.
- The sigmoid $\dfrac{1}{1 + e^{-z}}$ and the softmax $\dfrac{e^{z_i}}{\sum_j e^{z_j}}$ are quotients. [Part 4](/notebook/exponentials-logarithms-and-sines/) differentiates the sigmoid.

## Try it

1. $x^3$
2. $7x^4$
3. $x^5 + 3x^2$
4. $8x^7 - 4x^3 + 9$
5. $\dfrac{1}{x^2}$
6. $x^2(x + 3)$, using the product rule
7. $(x^3 + 2)\,x^2$, using the product rule
8. $\dfrac{x^3}{x + 2}$
9. $\dfrac{x^2 + 1}{x}$

<details>
<summary>Answers</summary>

1. $3x^2$
2. $28x^3$
3. $5x^4 + 6x$
4. $56x^6 - 12x^2$
5. $-2x^{-3} = -\dfrac{2}{x^3}$
6. $2x(x + 3) + x^2 = 3x^2 + 6x$
7. $3x^2 \cdot x^2 + (x^3 + 2) \cdot 2x = 5x^4 + 4x$
8. $\dfrac{3x^2(x + 2) - x^3}{(x + 2)^2} = \dfrac{2x^3 + 6x^2}{(x + 2)^2}$
9. $\dfrac{2x \cdot x - (x^2 + 1)}{x^2} = \dfrac{x^2 - 1}{x^2}$. Or split it first: $x + x^{-1}$ has derivative $1 - x^{-2}$, which is the same thing.

</details>
