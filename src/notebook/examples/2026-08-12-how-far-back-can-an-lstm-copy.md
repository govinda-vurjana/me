---
title: How far back can an LSTM copy?
date: 2026-08-12
kind: experiment
inquiry: example-recurrent-memory
status: complete
summary: A copy task with a growing delay, comparing a plain RNN with an LSTM of the same size.
result: (Illustrative) The LSTM holds a 10-symbol sequence across 200 steps; the plain RNN falls to chance after about 50.
repo: https://github.com/govinda-vurjana
---

## Question

If a network sees ten symbols, then a long stretch of blanks, can it still repeat the symbols when cued? How long can the blank stretch get before it forgets?

## Setup

Ten random symbols from an alphabet of eight, a delay of $T$ blank steps, a cue, then the model must output the ten symbols in order. Both models have 128 hidden units and are trained for the same number of steps.

```python
import torch

def copy_batch(batch_size, delay, length=10, n_symbols=8):
    seq = torch.randint(1, n_symbols + 1, (batch_size, length))
    blanks = torch.zeros(batch_size, delay, dtype=torch.long)
    cue = torch.full((batch_size, 1), n_symbols + 1)
    x = torch.cat([seq, blanks, cue, torch.zeros_like(seq)], dim=1)
    y = torch.cat([torch.zeros(batch_size, length + delay + 1, dtype=torch.long), seq], dim=1)
    return x, y
```

## Results

The numbers below are illustrative. This is a formatting example, not a real run.

| Delay $T$ | Plain RNN | LSTM |
|---:|---:|---:|
| 10 | 1.00 | 1.00 |
| 50 | 0.44 | 0.99 |
| 100 | 0.16 | 0.97 |
| 200 | 0.13 | 0.88 |
| 400 | 0.13 | 0.61 |

![Copy accuracy against delay for a plain RNN and an LSTM](/assets/img/examples/copy-task.svg "Figure 1. Copy accuracy as the delay grows (illustrative). The dashed line is chance, 1/8.")

::: callout Finding
The plain RNN does not fail gradually: it is near perfect, then near chance. The LSTM degrades slowly. That is what you would expect if one stores through a multiplicative chain and the other through an additive path.
:::

## What I learned

The failure shape matters as much as the failure point. A sharp collapse points to the gradient, not to capacity.

## Next

Measure the forget-gate activations during the delay. If they sit near one, the cell state is doing the remembering.
