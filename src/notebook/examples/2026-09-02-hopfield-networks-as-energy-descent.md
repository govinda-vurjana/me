---
title: Hopfield networks as energy descent
date: 2026-09-02
kind: note
inquiry: example-associative-memory
summary: Stored patterns are minima of an energy function; recall is rolling downhill from a fragment.
---

A Hopfield network stores patterns $\xi^\mu \in \{-1, +1\}^N$ in symmetric weights

$$
W = \frac{1}{N} \sum_{\mu=1}^{P} \xi^\mu (\xi^\mu)^\top, \qquad W_{ii} = 0
$$

and defines an energy over states $s$:

$$
E(s) = -\tfrac{1}{2}\, s^\top W s
$$

Updating one unit at a time with $s_i \leftarrow \operatorname{sign}\left(\sum_j W_{ij} s_j\right)$ never increases $E$. So the stored patterns act as valleys, and recall means starting from a corrupted pattern and descending to the nearest one.

The classical capacity is about $0.14N$ patterns before the valleys start to merge.
