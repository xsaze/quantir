# Trend Detection Frameworks Comparison

## Algorithm Selection Matrix

| Framework | Accuracy | Cost | Latency | Use Case | Interpretability |
|-----------|----------|------|---------|----------|------------------|
| **ARIMA/SARIMA** | Moderate | Low | <10ms | Linear, stationary, short-term | High (coefficients) |
| **Prophet** | Good | Medium | ~50ms | Seasonal business metrics | Medium (components) |
| **LSTM** | Highest | High | ~200ms | Complex, non-linear, long-term | Low (black box) |
| **XGBoost** | Good | Medium | ~30ms | Tabular data, mixed types | Medium-High (SHAP) |
| **Ensemble** | High | Medium-High | ~100ms | Reliability-critical | Medium |

## Decision Tree

```
Data Size?
├─ <10K records → ARIMA/SARIMA
├─ 10K-1M records
│  ├─ Strong seasonality? → Prophet
│  └─ Complex patterns? → XGBoost
└─ >1M records
   ├─ Linear patterns? → Ensemble (ARIMA + Prophet)
   └─ Non-linear? → LSTM or Hybrid (Prophet + LSTM)
```

## Performance Benchmarks

**ARIMA**:
- Training: <1 second (1K records)
- Inference: <1ms
- Memory: <50MB

**Prophet**:
- Training: 5-30 seconds (1M records)
- Inference: ~10ms
- Memory: 100-500MB

**LSTM**:
- Training: 1-8 hours (1M records, GPU)
- Inference: 50-200ms
- Memory: 500MB-2GB
- Accuracy: +10-20% vs statistical methods

**Hybrid (Prophet + LSTM)**:
- R² improvement: +20% vs standalone
- Use case: Trend (Prophet) + anomaly (LSTM)

## Quick Reference

**Start with statistical**: "Ensemble of 3-4 statistical models may be more powerful than expected"

**Escalate to ML**: Data >10K, seasonality patterns, need automation

**Deploy DL**: Data >1M, complex non-linear, maximum accuracy required, GPU available
