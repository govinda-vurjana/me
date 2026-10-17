---
title: Is a hidden state a memory, or a summary?
date: 2026-07-06
kind: thought
inquiry: example-recurrent-memory
---

A recurrent network carries one vector forward through time. We call it memory, but it is overwritten at every step. Maybe it is closer to a running summary: it keeps what is useful for predicting the next thing and lets the rest go.

If that is right, the useful question is not *how much* it stores but *what it is allowed to forget*.
