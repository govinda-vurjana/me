---
title: "Part 1: What a derivative measures"
date: 2026-10-20T10:01:00Z
kind: note
topic: calculus-for-ai
summary: A derivative is a rate of change at a single point. Here it is built from first principles and tied to the one question training asks of every weight.
---

## A function is a machine

A function takes an input and produces an output. Squaring is one:

$$
f(x) = x^2
$$

so $f(2) = 4$, $f(3) = 9$ and $f(10) = 100$. Think of it as a machine: $x$ goes in, $f(x)$ comes out. Almost everything in AI is a function in this sense. An image goes in and a label comes out; a sentence goes in and a next word comes out. A neural network is one very large function, built by plugging many small ones together.

## How fast is it changing?

Watch $f(x) = x^2$ as $x$ climbs one step at a time:

| $x$ | $f(x)$ | Rise from the row above |
|---:|---:|---:|
| 1 | 1 | |
| 2 | 4 | 3 |
| 3 | 9 | 5 |
| 4 | 16 | 7 |

Each step of 1 in $x$ produces a bigger rise than the last. The curve keeps getting steeper, so there is no single "slope of $x^2$": the slope depends on where you are. The **derivative** is the slope at one point, how fast the output is changing at that exact input.

A rate is always change in output divided by change in input. Drive 100 km in 2 hours and your average speed is $100 / 2 = 50$ km per hour. The derivative is the same idea.

## The definition, built up

Start at $x$ and move a small distance $h$, to $x + h$. The input changed by $h$, and the output changed by $f(x+h) - f(x)$. Their ratio is the average rate of change over that stretch:

$$
\frac{f(x+h) - f(x)}{h}
$$

You divide by $h$ because a rate is *per unit of input*, just as speed is per hour. Geometrically, this is the slope of the straight line through two points on the curve, called a secant.

Now let $h$ shrink. The second point slides toward the first, and the secant swings round until it just touches the curve at $x$. That touching line is the tangent, and its slope is the derivative:

$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

![Secant lines through x = 1 on y = x², turning into the tangent](/assets/img/math/secant-to-tangent.svg "Figure 1. Secants of y = x² through x = 1. For h = 2, 1 and 0.5 their slopes are 4, 3 and 2.5. As h shrinks they turn into the tangent, whose slope is 2.")

Why not simply set $h = 0$? Because then the fraction is $0/0$, which tells you nothing. The limit asks a different question: what number does the ratio *approach* as $h$ gets very small? For a smooth curve that number exists, and it is the derivative.

## Deriving the slope of $x^2$

Rather than memorise the answer, derive it. Put $f(x) = x^2$ into the definition:

$$
f'(x) = \lim_{h \to 0} \frac{(x+h)^2 - x^2}{h}
$$

Expand $(x+h)^2 = x^2 + 2xh + h^2$, and the $x^2$ terms cancel:

$$
\begin{aligned}
f'(x) &= \lim_{h \to 0} \frac{2xh + h^2}{h} \\
&= \lim_{h \to 0} \frac{h\,(2x + h)}{h} \\
&= \lim_{h \to 0}\,(2x + h)
\end{aligned}
$$

As $h$ goes to zero, only $2x$ is left:

$$
\boxed{\frac{d}{dx}\,x^2 = 2x}
$$

This matches the figure. At $x = 1$ the secant slopes are $2 + h$: that is $4, 3$ and $2.5$ for the three secants, closing in on the tangent slope of $2$.

## Checking it with numbers

At $x = 3$ the formula says the slope is $6$. Nudge $x$ by $0.01$:

$$
3.01^2 = 9.0601
$$

The output rose by $0.0601$, almost exactly $6 \times 0.01$. That is what a derivative is in practice: a local exchange rate. Near $x = 3$, each small bit of input buys six times as much output.

$$
\Delta f \approx f'(x)\,\Delta x
$$

Keep this line in mind. Every use of derivatives in AI comes back to it.

## What the number tells you

- **Sign.** If $f'(x) > 0$ the function is rising at $x$. If $f'(x) < 0$ it is falling. If $f'(x) = 0$ it is momentarily flat, as at the bottom of a valley or the top of a hill.
- **Size.** A large derivative means the output is very sensitive to the input there. A derivative near zero means small changes in the input barely matter.

## Where this shows up in AI

A model's error, its *loss*, is a function of its weights. Write it $L(w)$. The derivative $\dfrac{dL}{dw}$ answers the one question training needs answered: *if I nudge this weight, does the error go up or down, and how fast?*

- $\dfrac{dL}{dw} = -16$: increasing $w$ lowers the loss, steeply. Increase it.
- $\dfrac{dL}{dw} = 0.5$: increasing $w$ raises the loss a little. Decrease it a little.
- $\dfrac{dL}{dw} \approx 0$: the loss is flat in this weight, so moving it barely helps right now.

Training is nothing more than following that answer, a small step at a time, for every weight. The [topic page](/math/calculus-for-ai/) shows a one-weight model learning this way, and [Part 8](/notebook/the-gradient/) does it for many weights at once.

::: callout Hidden meaning
A derivative is a measure of responsibility. $\partial L / \partial w$ says how much of the current error is this weight's doing, and in which direction, so training is the work of assigning blame and correcting it. The answer is also only *local*: it treats the loss as a straight line near the current $w$, and a little further away that picture can be wrong. That is why a network learns by many small corrections rather than one leap to the answer.
:::

## Try it

1. Use the definition to find the derivative of $f(x) = 3x$.
2. Use the definition to find the derivative of $f(x) = x^3$. You will need $(x+h)^3 = x^3 + 3x^2h + 3xh^2 + h^3$.
3. Without any formula, estimate the slope of $x^2$ at $x = 5$ by computing $\dfrac{f(5.001) - f(5)}{0.001}$. How close is it to $2 \times 5$?

<details>
<summary>Answers</summary>

1. $\dfrac{3(x+h) - 3x}{h} = \dfrac{3h}{h} = 3$. A straight line has the same slope everywhere.
2. $\dfrac{3x^2h + 3xh^2 + h^3}{h} = 3x^2 + 3xh + h^2$, which tends to $3x^2$.
3. $5.001^2 = 25.010001$, so the ratio is $0.010001 / 0.001 = 10.001$. The extra $0.001$ is the leftover $h$ in $2x + h$.

</details>
