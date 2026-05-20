---
layout: page
permalink: /blog/
title: Blog
description: Short-form research notes and placeholders for future updates from ongoing research.
nav: true
nav_order: 9
---
## Planned Notes

- **Stress thresholds in grapevine:** notes on physiological and metabolic transition points under combined salinity and water deficit.
- **Rootstock-mediated resilience:** summaries of root-shoot trait relationships, ion partitioning, and genotype-specific acclimation.
- **UAV thermal phenotyping:** field observations linking canopy temperature, physiology, and heatwave response.
- **Predictive modeling:** practical notes on integrating physiological, metabolomic, phenological, and climate datasets.
- **Sorghum breeding lessons:** reflections from dryland crop improvement, multi-environment trials, and genotype-by-environment analysis.

This section is intentionally structured as a living research notebook. Full entries can be added as manuscripts, datasets, or conference outputs become ready to share.

## Social Updates

{% for post in site.data.social_posts %}

<div class="social-post">
  <p class="post-meta">
    {{ post.date | date: "%B %d, %Y" }}
    {% if post.platform == "LinkedIn" %}
      <i class="fa-brands fa-linkedin" aria-hidden="true"></i>
    {% elsif post.platform == "X" %}
      <i class="fa-brands fa-x-twitter" aria-hidden="true"></i>
    {% endif %}
    {{ post.platform }}
  </p>
  <h3><a href="{{ post.url }}" target="_blank" rel="noopener noreferrer">{{ post.title }}</a></h3>
  <p>{{ post.description }}</p>
</div>

{% endfor %}

