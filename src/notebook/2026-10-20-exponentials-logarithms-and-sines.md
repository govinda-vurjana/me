---
title: "Part 4: Exponentials, logarithms and sines"
date: 2026-10-20T10:04:00Z
kind: note
topic: calculus-for-ai
summary: The derivatives of the exponential, the logarithm, sine and cosine, and why they matter. They are the raw material of sigmoid, softmax, cross-entropy and positional encodings.
---

## The function that is its own slope

$$
\frac{d}{dx}\,e^x = e^x
$$

At every point, the slope of $e^x$ equals its height. The bigger it gets, the faster it grows. That is what exponential growth means: growth in proportion to size, like money left to compound. The number $e \approx 2.718$ is the one base for which the slope and the height are exactly equal.

With the chain rule, whatever sits in the exponent contributes its own derivative:

$$
\frac{d}{dx}\,e^{u} = e^{u}\,\frac{du}{dx}
$$

$$
\begin{aligned}
\frac{d}{dx}\,e^{3x + 2} &= 3\,e^{3x + 2} \\
\frac{d}{dx}\,e^{2x} &= 2\,e^{2x} \\
\frac{d}{dx}\,e^{x^2 + 3} &= 2x\,e^{x^2 + 3}
\end{aligned}
$$

The base stays $e$. The factor in front comes from differentiating the exponent.

## The logarithm asks "what power?"

Since $2^3 = 8$, the logarithm of 8 to base 2 is 3: $\log_2 8 = 3$. The natural logarithm, $\ln$, uses base $e$, and it undoes the exponential:

$$
\ln(e^x) = x \qquad e^{\ln x} = x
$$

Its derivative is

$$
\frac{d}{dx}\,\ln x = \frac{1}{x}
$$

The reason is a picture. The graph of $\ln x$ is the graph of $e^x$ reflected in the line $y = x$. Reflecting swaps rise and run, so every slope turns into its reciprocal. The point $(x, \ln x)$ on the log curve matches the point $(\ln x, x)$ on the exponential curve, where the slope is $e^{\ln x} = x$. So the log curve's slope is $1/x$.

With the chain rule:

$$
\frac{d}{dx}\,\ln u = \frac{1}{u}\,\frac{du}{dx}
$$

$$
\begin{aligned}
\frac{d}{dx}\,\ln(x^2 + 1) &= \frac{2x}{x^2 + 1} \\
\frac{d}{dx}\,\ln(3x + 2) &= \frac{3}{3x + 2}
\end{aligned}
$$

Two details are worth knowing:

- $\ln x$ only exists for $x > 0$. The version that works on both sides of zero is $\ln|x|$, and its derivative is also $1/x$. For example, $\ln(x^2) = 2\ln|x|$, whose derivative is $2/x$.
- Logarithms turn products into sums, $\ln(ab) = \ln a + \ln b$, and powers into products, $\ln(a^b) = b\ln a$. Both turn hard derivatives into easy ones.

## Other bases

$$
\frac{d}{dx}\,a^x = a^x \ln a
$$

The $\ln a$ comes from rewriting the base as a power of $e$. Since $a = e^{\ln a}$, we have $a^x = e^{x \ln a}$, and the chain rule gives $e^{x \ln a} \cdot \ln a = a^x \ln a$. The factor $\ln a$ compares base $a$ with base $e$: $\ln 2 \approx 0.69$, so $2^x$ grows more slowly than its own size, while $\ln 5 \approx 1.61$. Because $\ln e = 1$, the rule for $e^x$ is the special case.

## Logarithmic differentiation

$y = x^x$ fits none of the rules so far. The power rule needs a fixed exponent, and the exponential rule needs a fixed base; here both vary. Take $\ln$ of both sides to bring the exponent down:

$$
\ln y = x \ln x
$$

Now differentiate both sides with respect to $x$. On the right, the product rule gives $\ln x + x \cdot \tfrac{1}{x} = \ln x + 1$. On the left, $y$ depends on $x$, so the chain rule gives $\tfrac{1}{y}\,\tfrac{dy}{dx}$. [Part 5](/notebook/implicit-differentiation/) explains this step in detail.

$$
\frac{1}{y}\,\frac{dy}{dx} = \ln x + 1
$$

Multiply both sides by $y = x^x$:

$$
\frac{dy}{dx} = x^x\,(\ln x + 1)
$$

## Sine, cosine and tangent

$$
\begin{aligned}
\frac{d}{dx}\sin x &= \cos x \\
\frac{d}{dx}\cos x &= -\sin x \\
\frac{d}{dx}\tan x &= \sec^2 x
\end{aligned}
$$

Picture a point going round a circle at steady speed, with $\sin t$ as its height. At the top of the circle the point is moving sideways, so its height has momentarily stopped changing, and that is where $\cos t = 0$. As it crosses the middle it is moving straight up or down, so its height changes fastest, and $\cos t = \pm 1$. The rate of change of the height follows the cosine.

The tangent follows from the quotient rule, since $\tan x = \sin x / \cos x$. The top of the quotient rule is $\cos x \cdot \cos x - \sin x \cdot (-\sin x) = \cos^2 x + \sin^2 x$, which is 1 by Pythagoras:

$$
\begin{aligned}
\frac{d}{dx}\tan x &= \frac{\cos^2 x + \sin^2 x}{\cos^2 x} \\[4pt]
&= \frac{1}{\cos^2 x} = \sec^2 x
\end{aligned}
$$

The chain rule works as always: $\dfrac{d}{dx}\sin 3x = 3\cos 3x$.

## Where these show up in AI

**Sigmoid.** The function

$$
\sigma(z) = \frac{1}{1 + e^{-z}}
$$

squashes any number into the range 0 to 1. It turns a score into a probability, and it builds the gates of an LSTM. Its derivative needs only the rules so far. Write $\sigma = (1 + e^{-z})^{-1}$ and use the power rule with the chain rule:

$$
\begin{aligned}
\sigma'(z) &= -(1 + e^{-z})^{-2} \cdot \left(-e^{-z}\right) \\[4pt]
&= \frac{e^{-z}}{(1 + e^{-z})^2} \\[4pt]
&= \sigma(z)\,\big(1 - \sigma(z)\big)
\end{aligned}
$$

The tidy final form means a network that has already computed $\sigma$ gets its derivative almost for free. Its largest value is $0.25$, at $z = 0$. Stack many sigmoids and the chain rule multiplies many numbers no bigger than $0.25$, which is one reason deep stacks of sigmoids were hard to train ([Part 3](/notebook/the-chain-rule/)). Most modern networks use the ReLU, $\max(0, z)$, whose slope is exactly 1 for every positive input.

**Softmax.** A language model ends by scoring every possible next token, then turning the scores $z_i$ into probabilities:

$$
p_i = \frac{e^{z_i}}{\sum_j e^{z_j}}
$$

The exponential makes every score positive, and dividing by the sum makes them add up to 1.

**Cross-entropy.** The loss most models train on is the negative log of the probability the model gave the right answer, $L = -\ln p$. If that probability is $0.9$ the loss is $0.105$; if it is $0.01$ the loss is $4.6$. The derivative, $-1/p$, is huge when $p$ is tiny, so confident mistakes are corrected hardest. Combined with softmax, the derivative of this loss with respect to each score $z_i$ comes out remarkably simple: $p_i - 1$ for the right answer and $p_i$ for every other. Models also work with log-probabilities rather than probabilities because multiplying thousands of small probabilities underflows to zero, while adding their logarithms does not.

**Sines and cosines.** The original Transformer told the network where each word sits in a sentence by adding sine and cosine waves of different frequencies to it.[^1] Many current language models use rotary position embeddings instead, which rotate pairs of components of each query and key vector by an angle that grows with position, and rotations are built from $\sin$ and $\cos$.[^2] Networks that use $\sin$ as their activation function can represent images, sound and 3D shapes as smooth functions.[^3] In all of these, training needs the derivatives above.

## Try it

1. $e^{2x}$
2. $e^{x^2 + 3}$
3. $4^x$
4. $\ln(3x + 2)$
5. $x^x$
6. $\cos 2x$
7. $\sin(x^2)$
8. $\tan(5x + 1)$

<details>
<summary>Answers</summary>

1. $2e^{2x}$. The base stays $e$; the 2 comes from the exponent.
2. $2x\,e^{x^2 + 3}$
3. $4^x \ln 4$
4. $\dfrac{3}{3x + 2}$
5. $x^x(\ln x + 1)$
6. $-2\sin 2x$
7. $2x\cos(x^2)$
8. $5\sec^2(5x + 1)$

</details>

[^1]: Vaswani et al. (2017), “Attention is all you need”, section 3.5.
[^2]: Su et al. (2021), “RoFormer: Enhanced Transformer with rotary position embedding”.
[^3]: Sitzmann et al. (2020), “Implicit neural representations with periodic activation functions” (SIREN).
