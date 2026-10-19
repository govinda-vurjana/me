---
title: Calculus for AI, from scratch
section: math
status: exploring
started: 2026-10-20
summary: Differentiation from first principles up to gradients, Jacobians and Hessians, with every idea tied to the place it shows up in a neural network.
# Shown as buttons on this page and on every part. Rebuild the PDFs with `npm run pdf`.
resources:
  - label: Cheat sheet
    url: /math/cheat-sheet/
  - label: Cheat sheet PDF
    url: /assets/pdf/math-for-ai-cheat-sheet.pdf
  - label: Full series PDF
    url: /assets/pdf/calculus-for-ai.pdf
log:
  - date: 2026-10-20
    text: Worked from first principles through to the Hessian, and wrote it up in nine parts.
---

Every neural network learns the same way. It makes a prediction, measures how wrong it was, and adjusts each of its weights in whichever direction makes it less wrong. Finding that direction is calculus. This series builds that calculus from nothing: school algebra is enough to start, and nothing is asked to be memorised without first seeing where it comes from.

## A model learning, by hand

Here is the whole idea at its smallest. A model with one weight $w$ predicts $\hat y = wx$. Show it one example, $x = 2$, whose right answer is $y = 6$, and score its error with the squared loss:

$$
L(w) = (wx - y)^2 = (2w - 6)^2
$$

Its derivative ([Part 3](/notebook/the-chain-rule/) shows how to get it) is

$$
\frac{dL}{dw} = 2x\,(wx - y) = 4\,(2w - 6)
$$

Start from a bad guess, $w = 1$, and repeat one rule: move $w$ a small step against the derivative, $w \leftarrow w - 0.05\,\dfrac{dL}{dw}$.

| Step | $w$ | Prediction $2w$ | Loss | $dL/dw$ |
|---:|---:|---:|---:|---:|
| 0 | 1.00 | 2.00 | 16.00 | −16.00 |
| 1 | 1.80 | 3.60 | 5.76 | −9.60 |
| 2 | 2.28 | 4.56 | 2.07 | −5.76 |
| 3 | 2.57 | 5.14 | 0.75 | −3.46 |
| 4 | 2.74 | 5.48 | 0.27 | −2.07 |

![The one-weight model taking steps down its loss curve toward w = 3](/assets/img/math/descent-one-weight.svg "Figure 1. The same steps on the loss curve. Each one moves against the slope, and because the slope flattens near the bottom, the steps shrink on their own.")

The derivative is negative, which says "increasing $w$ lowers the loss", so $w$ goes up. As the error shrinks the derivative shrinks with it, and the steps get shorter on their own. The weight closes in on $w = 3$, where the prediction is exactly right.

A large language model runs this same loop over billions of weights at once. The optimiser is more refined and the arithmetic is enormous, but every step still needs the derivative of the loss with respect to every weight, and the chain rule is what supplies it.

## Read in order

1. [What a derivative measures](/notebook/what-a-derivative-measures/). Rate of change, built from first principles.
2. [The derivative rules, and why they work](/notebook/the-derivative-rules/). Powers, sums, products and quotients.
3. [The chain rule](/notebook/the-chain-rule/). Functions inside functions, and backpropagation in miniature.
4. [Exponentials, logarithms and sines](/notebook/exponentials-logarithms-and-sines/). The functions behind sigmoid, softmax, cross-entropy and positional encodings.
5. [Implicit differentiation](/notebook/implicit-differentiation/). When $y$ is tangled up with $x$.
6. [The second derivative](/notebook/the-second-derivative/). Curvature, and why it caps the learning rate.
7. [Partial derivatives and one neuron](/notebook/partial-derivatives-and-one-neuron/). Many inputs, and a first backward pass by hand.
8. [The gradient, and which way is downhill](/notebook/the-gradient/). Gradients, directional derivatives and gradient descent.
9. [Jacobians and Hessians](/notebook/jacobians-and-hessians/). Derivatives of whole layers, and the shape of the loss landscape.

Then read [The hidden meaning of the calculus](/notebook/the-hidden-meaning-of-the-calculus/), which reads every result in the series as a statement about how a network learns.

## How each part works

Each part runs in the same order: the intuition first, then the definition, a derivation, worked examples, where the idea shows up in AI, and exercises. Each part also has a *hidden meaning*: what the result says about how a network learns. Anyone can learn to compute a derivative; knowing what it means is what makes it useful for AI. On the site the answers are folded away, so you can try first. Wherever possible a result is checked with plain numbers as well as algebra.
