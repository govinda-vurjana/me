---
layout: layouts/section.njk
title: Math
section: math
summary: Derivations, proofs, and worked notes, both the mathematics behind the work on memory and mathematics in its own right.
permalink: /math/
---

A common belief is that AI runs on data and computing power, and that the mathematics is optional. It isn't. A neural network is one large function with millions or billions of adjustable numbers inside it, its weights. Training it means asking, for every weight: *if this number moved a little, would the error go up or down, and by how much?* That question is a derivative. Backpropagation, the algorithm that trains every modern network, is the chain rule from calculus applied many millions of times.

Calculus is one of several branches the field rests on:

| Mathematics | Where it lives in AI |
|---|---|
| Calculus | Training. Backpropagation is the chain rule, and gradient descent follows the derivative downhill. |
| Linear algebra | Every layer multiplies a vector by a matrix. Attention compares vectors with dot products. |
| Probability | A language model's output is a probability distribution over the next token. |
| Information theory | Cross-entropy, the loss most models train on, measures how surprised a model is by the right answer. |
| Optimisation | The update rules that turn gradients into learning: SGD, momentum, Adam. |
| Dynamical systems | Recurrent networks and associative memories, whose state evolves step by step. |

I'm learning this mathematics from the ground up and writing it down as I go, so that anyone starting from zero can follow the same path. Each idea is derived rather than memorised, checked with plain numbers, and tied to the place it appears in a real network. Each one also gets its *hidden meaning*: what the result says about how a network learns. Computing a derivative is the easy part; knowing what it means is what makes it AI mathematics.

**Start with [Calculus for AI, from scratch](/math/calculus-for-ai/)**: from what a derivative measures to gradients, Jacobians and Hessians.

For a quick look, the [cheat sheet](/math/cheat-sheet/) puts every concept on one page: its formula, the idea in a sentence, where it shows up in AI, and its hidden meaning. [The hidden meaning of the calculus](/notebook/the-hidden-meaning-of-the-calculus/) reads the whole series that way. The cheat sheet and the series are also available as PDFs.

<p class="resource-links">
  <a class="pill" href="/math/cheat-sheet/">Cheat sheet</a>
  <a class="pill" href="/assets/pdf/math-for-ai-cheat-sheet.pdf" download>Cheat sheet PDF</a>
  <a class="pill" href="/assets/pdf/calculus-for-ai.pdf" download>Full series PDF</a>
</p>
