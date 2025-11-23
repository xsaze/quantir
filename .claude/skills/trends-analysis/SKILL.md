---
name: trends-analysis
description: AI-powered trend detection, predictive analytics, social listening, and opportunity identification. Use when analyzing market trends, forecasting future patterns, monitoring social media sentiment, detecting emerging opportunities, or implementing production-ready trend detection systems with MLOps, security, and compliance.
license: MIT
---

# Trends Analysis

MUST identify emerging trends, predict opportunities, analyze social sentiment using AI-powered analytics with MINIMUM 95% accuracy.

## Purpose

Execute comprehensive trend detection combining ML algorithms (ARIMA/Prophet/LSTM), social listening (sentiment analysis, entity recognition), and predictive analytics for opportunity identification. Implements production-grade systems with MLOps pipelines, security hardening (adversarial defense, data poisoning protection), and regulatory compliance (GDPR, HIPAA, SOC2).

## When to Use This Skill

This skill should be used when:

- **Detecting market trends**: Analyze time series data to forecast future patterns, identify emerging opportunities
- **Social listening**: Monitor social media sentiment (Twitter, Reddit, Instagram), track brand mentions, competitor benchmarking
- **Predictive analytics**: Build production-ready forecasting systems with automated retraining, drift detection
- **Opportunity identification**: Use data-driven frameworks (SWOT, Porter's Five Forces) to discover business expansion opportunities
- **Security hardening**: Implement defense against data poisoning (250 documents backdoor threat), adversarial attacks, prompt injection
- **MLOps deployment**: Design Lambda architecture (batch+real-time), microservices, monitoring pipelines

## How Claude Uses This Skill

### Trend Detection Workflow

**Task**: Execute comprehensive trend detection combining ML algorithms, social listening, predictive analytics for opportunity identification.

**Context**: Trend analysis requires multimodal data processing (text, images, video, audio, sensor), time series forecasting (ARIMA/Prophet/LSTM), sentiment analysis via NLP. Production systems use Lambda architecture (batch+real-time), MLOps pipelines, drift detection. Security threats include data poisoning (250 documents backdoor models), adversarial attacks, prompt injection requiring defense-in-depth.

**Requirements**:

1. **MUST detect trends using MINIMUM 3 algorithms**: Statistical (ARIMA/SARIMA), ML (Prophet/XGBoost), DL (LSTM) with ensemble
   - Reference `frameworks-comparison.md` for algorithm selection (data size, pattern type, latency requirements)
   - Start with statistical models: "Ensemble of 3-4 statistical models may be more powerful than expected"
   - Escalate to ML for data >10K records, seasonality patterns
   - Deploy DL for data >1M records, complex non-linear patterns

2. **ONLY process validated data**: Encryption at rest (AES-256), in transit (TLS 1.3+), access control (RBAC), audit logging
   - Apply `security-checklist.md` pre-deployment audit (data, model, infrastructure, application security)
   - Implement adversarial training (FGSM/PGD algorithms)
   - Enable XAI compliance (SHAP/LIME for top 5 feature explanations)

3. **MUST EXACTLY implement MLOps**: Automated retraining, drift detection (KS/PSI/Chi-square), monitoring (Prometheus/Grafana), version control
   - Follow `implementation-patterns.md` MLOps pipeline pattern
   - Deploy drift detection: KS test p-value <0.05 alert threshold
   - Configure automated retraining triggers: schedule (weekly minimum), performance threshold, drift detection
   - Track model health: accuracy (MAE, RMSE, R²), latency (p50, p95, p99), error rates, throughput

4. **MUST achieve social listening**: Sentiment analysis (positive/negative/neutral), entity recognition, sarcasm detection, platform aggregation (Twitter/Reddit/Instagram)
   - Implement social listening pipeline from `implementation-patterns.md` (API collectors → Kinesis → Lambda → NLP → storage → dashboards)
   - Process multimodal data: text (transformers, BERT), images (CNN, YOLO), video (frame extraction), audio (speech-to-text)
   - Handle edge cases: double negatives, emojis, cultural context, platform bias (Twitter/Reddit overrepresented)

5. **ONLY deploy with security**: Adversarial training, input validation, XAI compliance (SHAP/LIME), incident response playbooks
   - Execute `security-checklist.md` pre-deployment audit (all checkboxes verified)
   - Defend against data poisoning: strict access controls, data source validation, anomaly detection in training datasets
   - Mitigate adversarial attacks: include adversarial examples in training (FGSM/PGD), input perturbation detection, query rate limiting
   - Implement incident response: model poisoning (rollback to registry), data breach (GDPR 72-hour notification), DDoS (CloudFlare/AWS Shield)

6. **MUST identify opportunities**: Market trend analysis, customer segmentation, ROI measurement, competitive benchmarking
   - Apply data-driven frameworks: SWOT analysis, Porter's Five Forces, PESTLE analysis, scorecard approach
   - Calculate social listening ROI: (Value Generated - Costs) / Costs × 100
   - Track metrics: volume of mentions, sentiment %, engagement rate, conversion rate, share of voice vs. competitors

### Bundled Resources

**References** (loaded as-needed):

- `references/frameworks-comparison.md`: Algorithm selection matrix (ARIMA vs Prophet vs LSTM), decision tree, performance benchmarks, quick reference
- `references/security-checklist.md`: Pre-deployment audit (data, model, infrastructure, application security), attack vector defenses (data poisoning, adversarial, prompt injection), compliance requirements (GDPR, HIPAA, SOC2), incident response playbooks
- `references/implementation-patterns.md`: Lambda architecture (batch+real-time), social listening pipeline (AWS reference), MLOps pipeline (training, deployment, monitoring, retraining), microservices architecture, technology stacks (AWS, open-source, hybrid), deployment strategies, roadmap

### Constraints

- **Model accuracy**: MINIMUM 95% on validation set
- **Latency**: MAXIMUM 500ms for real-time predictions
- **Data freshness**: MAXIMUM 5 minutes lag for social listening
- **Retraining frequency**: MINIMUM weekly, trigger on drift detection
- **NEVER deploy without drift monitoring** (KS test p-value <0.05 alert threshold)
- **NEVER use models without XAI** (SHAP values MUST explain top 5 features)
- **NEVER skip security audit** (adversarial robustness test MINIMUM 3 attack types: evasion, inversion, extraction)

### Output

Production-ready trend detection system with:

1. **Automated pipelines**: Data ingestion (ETL/ELT), feature engineering, model training, deployment, retraining
2. **Monitoring dashboards**: Prometheus + Grafana for metrics, Arize AI/WhyLabs for ML-specific monitoring, ELK Stack for logs
3. **Security hardening**: Adversarial training, input validation, access controls (RBAC), encryption (AES-256 at rest, TLS 1.3+ in transit), incident response playbooks
4. **Compliance documentation**: GDPR (Right to Explanation, Right to Deletion), HIPAA (PHI encryption, access logs), SOC2 (audit trails, availability 99.9%+)

## Best Practices

**Algorithm Selection** (from `frameworks-comparison.md`):
- Data <10K records → ARIMA/SARIMA (low cost, high interpretability)
- Data 10K-1M records + seasonality → Prophet (automatic holiday handling, missing data tolerance)
- Data >1M records + complex patterns → LSTM (highest accuracy, +10-20% vs statistical)
- Hybrid approach: Prophet (trend) + LSTM (anomaly) for +20% R² improvement

**Security** (from `security-checklist.md`):
- Critical threat: 250 poisoned documents can backdoor AI models (2025 research: Anthropic, UK AI Security Institute)
- Implement adversarial training: include FGSM/PGD adversarial examples in training data
- Monitor for attacks: unusual query patterns (model extraction), sudden accuracy drop (>5% = poisoning indicator), failed authentication tracking

**MLOps** (from `implementation-patterns.md`):
- "Integrating MLOps workflow allows moving models from development into production data pipelines for reliable, scalable inference"
- Principle: "Traditional software doesn't degrade, ML models do" → Continuous monitoring essential
- Drift detection tests: KS (distribution comparison), PSI (feature drift), Chi-square (categorical drift)

**Deployment Strategy**:
- Batch: Scheduled predictions (daily/hourly), lower cost, example: daily demand forecasting
- Real-time: HTTPS endpoint, sub-second latency, example: fraud detection, social listening alerts
- Hybrid: Batch baseline + real-time adjustments (most common production pattern)

## Anti-Patterns

**❌ NEVER**:
- Deploy without drift monitoring (models degrade over time)
- Skip adversarial training (vulnerable to data poisoning with only 250 documents)
- Use black-box models without XAI (GDPR Article 22 requires explainability)
- Train-serve skew (different preprocessing logic between training and serving)
- Ignore platform bias (Twitter/Reddit dominate social datasets, skew results)
- Accept <80% sentiment accuracy (top ML competitions achieve ~80%, demand minimum 95%)

**✅ ALWAYS**:
- Start with statistical models, escalate to ML/DL as needed
- Implement defense-in-depth (data, model, infrastructure, application, monitoring layers)
- Version control for datasets (Git LFS, DVC) and models (MLFlow, SageMaker Registry)
- Test incident response playbooks (quarterly drills for model poisoning, data breach, DDoS, model extraction)
- Validate compliance requirements: GDPR (72-hour breach notification), HIPAA (PHI encryption), SOC2 (audit trails)

## Quick Reference

**Market Growth**:
- Predictive analytics: $22.1B by 2025 (21.8% annual growth)
- Multimodal AI: $1.4B → $12.8B by 2025 (33.4% CAGR)
- Edge analytics: $1.4B → $10.9B by 2025 (33.8% CAGR)

**Key Statistics**:
- 75% of companies planning AI-powered predictive analytics implementation by 2025
- Companies with AI analytics: 2.8x more likely to experience significant growth
- Revenue impact: 10-20% increases, 10-15% cost reductions
- XAI adoption: 75% of organizations implemented by 2025 (GDPR compliance, trust)

**Tool Recommendations**:
- AWS stack: Kinesis + S3 + SageMaker + CloudWatch (enterprise scale)
- Open-source stack: Kafka + Spark + Hugging Face + Airflow + Grafana (cost-conscious)
- Hybrid stack: R/Python statsmodels + scikit-learn + PyTorch + FastAPI + Kubernetes (research organizations)
