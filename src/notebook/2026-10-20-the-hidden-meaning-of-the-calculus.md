---
title: The hidden meaning of the calculus
date: 2026-10-20T10:10:00Z
kind: note
topic: calculus-for-ai
summary: Anyone can learn to compute a partial derivative. What matters for AI is what each result says about how a network learns. Here is every idea in the series, read that way.
---

Computing a partial derivative is a skill anyone can pick up in an afternoon. Knowing what it *means* for a network is different, and it is the part that matters. It is what lets you look at an equation in a paper and see a behaviour, a failure, or the idea for a fix. Mechanics make you someone who can do calculus. Meaning makes you someone who can think about AI with it.

The nine parts of this series each end with a *hidden meaning*. Here they are together, because they turn out to tell one story: how a network learns, and where that learning breaks.

## A derivative is blame

When a network gets something wrong, every weight shares in the error, but not equally. $\partial L / \partial w$ is how much of it belongs to $w$, and in which direction. Training is nothing more than measuring that blame for every weight and nudging each one to reduce it.

The blame is only valid nearby. A derivative treats the loss as a straight line around the current weights, which is true for a short distance and false further away. That is why no network is trained in one jump: it is trained by thousands of small corrections, each trusting the straight line for one short step. ([Part 1](/notebook/what-a-derivative-measures/))

## Learning is a vote

The loss on a dataset is the sum of the losses on its examples, and derivatives of sums are sums of derivatives. So every example votes on how every weight should move, and the gradient is the tally. A random mini-batch is a fair sample of the vote, which is the only reason training on billions of examples is possible: you never need to count every ballot to know which way the election is going. ([Part 2](/notebook/the-derivative-rules/))

## Depth is multiplication

A weight in the first layer never touches the loss. Its influence passes through every later layer, and the chain rule says its blame is the *product* of every local rate along the way. That is credit assignment, the central problem of training deep networks.

Products are fragile. One link close to zero silences everything upstream, and a long chain of rates below 1 shrinks to nothing. In a recurrent network the chain runs through time, so vanishing gradients are a statement about memory: an input from 100 steps ago can only shape learning if its influence survives 100 multiplications. Residual connections, LSTM gates and careful initialisation are all ways of keeping that product near 1. ([Part 3](/notebook/the-chain-rule/))

## Gates decide what gets learned

The product rule says each factor's change is scaled by the other factor's size. So when a gate multiplies a signal and the gate is near zero, the signal gets almost no gradient: the network has chosen not to learn from it for now. A ReLU does the same thing as a switch. Units that are off pass no gradient back, so each input trains only the part of the network it switched on. ([Part 2](/notebook/the-derivative-rules/), [Part 4](/notebook/exponentials-logarithms-and-sines/))

A sigmoid that is far from zero has the opposite problem. It is so certain that its slope is almost flat, and a flat slope passes back almost nothing. A saturated unit has stopped listening.

## Networks think in log-odds and learn from surprise

The exponential turns adding into multiplying. Raise one softmax score by 1 and its odds against every other option are multiplied by $e$, so the scores inside a classifier or a language model are really log-odds. The logarithm turns multiplying back into adding, so evidence that multiplies as probability adds as log-probability, and the cross-entropy loss $-\ln p$ is a measure of surprise.

The two meet in the learning signal of the output layer, $p_i - y_i$: what the model believed minus what was true. A confident, correct prediction produces almost no gradient. A confident, wrong one produces a large one. The network learns most from the examples that surprise it. ([Part 4](/notebook/exponentials-logarithms-and-sines/))

## "All else equal" only holds up close

A partial derivative judges each weight as if it acted alone. That is a useful fiction: in a real step every weight moves together, and their effects interact. The fiction holds for small steps and breaks for large ones, which is another reason learning rates are small.

Look at what the gradient of one neuron says, too: the update to a weight is the signal coming in times the error coming back. That has the shape of Hebb's rule, in which a connection strengthens when the cells on both sides are active together. Here the error coming back stands in for the second cell. ([Part 7](/notebook/partial-derivatives-and-one-neuron/))

## The gradient is short-sighted

The gradient points the way the loss increases fastest from where you stand, and nowhere else. A step along a contour changes nothing, so a gradient step spends all of its length where it counts. But it is greedy and local. It knows which way is down from *here*, and nothing about where the deepest valley is. Every trained network is the accumulated result of many short-sighted steps. ([Part 8](/notebook/the-gradient/))

## Curvature is how far to trust the slope

The second derivative says how quickly the slope changes, which is to say how soon the straight-line picture stops being true. High curvature means a short trust distance and a small safe learning rate: $\eta$ has to stay below $2 / L''$, and the sharpest direction among billions sets the limit for all of them. Newton's method uses the curvature to choose the distance as well as the direction. It is too expensive at scale, and much of optimiser design is about cheaply estimating what plain gradient descent is missing.

Curvature also describes what kind of place training has reached. The bottom of a narrow ravine is sensitive to small changes in the weights; the bottom of a broad plain is not. Whether broad, flat minima generalise better is an influential and still debated idea. ([Part 6](/notebook/the-second-derivative/), [Part 9](/notebook/jacobians-and-hessians/))

## A layer decides what survives

A layer's Jacobian says how it responds to small changes in its input: which directions it stretches, which it squashes, which it ignores. Backpropagation multiplies by the same matrix transposed, which stretches and squashes by the same amounts. So a layer that throws information away on the way forward also weakens the learning signal on the way back. One matrix governs both what a network can represent and what it can learn. ([Part 9](/notebook/jacobians-and-hessians/))

## Some answers have no history

An equilibrium is defined by a condition, *the state where nothing changes any more*, not by the steps that reached it. Implicit differentiation shows how such an answer moves when its inputs move, without the history. For memory this is a deep point: if recall means settling into a fixed point, as in an associative memory, then the memory can be trained at the fixed point itself, whatever path led there. ([Part 5](/notebook/implicit-differentiation/))

## The whole series in one table

| Mathematics | What you compute | What it means for AI |
|---|---|---|
| Derivative | A slope | Blame for the error, valid only nearby |
| Sum rule | Rates add | Every example votes; a batch samples the vote |
| Product rule | Each factor scaled by the other | Gates decide what gets learned |
| Chain rule | Rates multiply | Credit assignment; memory fades through long products |
| Exponential and log | Growth and its inverse | Scores are log-odds; loss is surprise |
| Softmax gradient | $p_i - y_i$ | The network learns from being wrong |
| Partial derivative | One input at a time | "All else equal", true only for small steps |
| Gradient | Steepest climb | Local and greedy: down from here, nothing more |
| Second derivative | How the slope changes | How far to trust a step; the learning-rate limit |
| Jacobian | All the output rates | What survives forward and what learning survives backward |
| Hessian | All the curvatures | Bowl, saddle, ravine or plain |
| Implicit differentiation | Slope from a condition | Equilibria, and memories, trained without their history |

The algebra in this series is standard, and the same for everyone. Reading it this way is what turns it into a tool for thinking about learning.
