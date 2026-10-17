---
title: Backpropagation through time, written out
date: 2026-07-21
kind: note
section: math
topic: example-recurrent-memory
summary: Why gradients in a plain RNN shrink or explode with distance, and what the LSTM cell changes.
---

## The recurrence

A plain recurrent network updates its hidden state with the same weights at every step:

$$
h_t = \tanh\left(W h_{t-1} + U x_t + b\right)
$$

The loss at step $T$ depends on an early state $h_k$ only through the chain of every state in between, so its gradient is a product of Jacobians:

$$
\frac{\partial h_T}{\partial h_k} = \prod_{t=k+1}^{T} \operatorname{diag}\!\left(1 - h_t^2\right) W
$$

## Why it vanishes

Each factor scales the gradient by roughly the largest singular value of $W$, damped by the $\tanh$ derivative. Over $T - k$ steps that is approximately $\lVert W \rVert^{T-k}$: below one it decays exponentially, above one it explodes.[^1]

## What the LSTM changes

The LSTM adds a cell state that is updated *additively*:

$$
c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t
$$

When the forget gate $f_t$ stays near one, $\partial c_t / \partial c_{t-1} \approx 1$ and the gradient can travel a long way without shrinking. The gates decide what is kept, which connects back to the [earlier thought](/notebook/is-a-hidden-state-a-memory/) about what a network is allowed to forget.

## References

- Elman, J. L. (1990). Finding structure in time. *Cognitive Science*, 14(2).
- Hochreiter, S. & Schmidhuber, J. (1997). Long short-term memory. *Neural Computation*, 9(8).

[^1]: Pascanu, Mikolov & Bengio (2013), “On the difficulty of training recurrent neural networks”, make this argument precise.
