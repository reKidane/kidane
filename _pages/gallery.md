---
layout: page
permalink: /gallery/
title: Gallery
description: Figures from published papers, from leaf metabolism to vineyard climate and sorghum trials.
nav: true
nav_order: 10
---

{% assign figs = site.data.figures.figures %}

<div class="kr-gallery" data-kr-gallery>

  <!-- Spotlight: featured figures cross-fade on a slow timer -->
  <section class="kr-spotlight" aria-label="Featured figures" aria-roledescription="carousel">
    <div class="kr-spotlight-stage">
      {% for fig in figs %}
        {% if fig.featured %}
          {% assign paper = site.data.figures.papers[fig.paper] %}
          <figure class="kr-spot" data-index="{{ forloop.index0 }}" aria-roledescription="slide">
            <div class="kr-spot-mat">
              <img src="{{ '/assets/img/figures/' | append: fig.id | append: '.jpg' | relative_url }}" alt="{{ fig.title | escape }}" width="{{ fig.width }}" height="{{ fig.height }}" loading="lazy" decoding="async">
            </div>
            <figcaption class="kr-spot-caption">
              <span class="kr-fig-kicker">{{ paper.journal }} · {{ paper.year }} · {{ fig.fig }}</span>
              <span class="kr-spot-title">{{ fig.title }}</span>
              <span class="kr-spot-text">{{ fig.caption }}</span>
              <button type="button" class="kr-btn kr-btn-gold kr-spot-open" data-open="{{ fig.id }}">Open figure</button>
            </figcaption>
          </figure>
        {% endif %}
      {% endfor %}
    </div>
    <div class="kr-spotlight-nav">
      <button type="button" class="kr-spot-arrow" data-dir="-1" aria-label="Previous featured figure"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button>
      <div class="kr-spot-dots" role="tablist" aria-label="Choose a featured figure"></div>
      <button type="button" class="kr-spot-arrow" data-dir="1" aria-label="Next featured figure"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
    </div>
  </section>

  <!-- Filters -->
  <div class="kr-gfilter" role="toolbar" aria-label="Filter figures">
    <button type="button" class="kr-gchip is-active" data-filter="all" aria-pressed="true">All <span>{{ figs.size }}</span></button>
    <button type="button" class="kr-gchip" data-filter="grapevine" aria-pressed="false">Grapevine</button>
    <button type="button" class="kr-gchip" data-filter="sorghum" aria-pressed="false">Sorghum</button>
    <button type="button" class="kr-gchip" data-filter="networks" aria-pressed="false">Networks</button>
    <button type="button" class="kr-gchip" data-filter="thresholds" aria-pressed="false">Thresholds</button>
    <button type="button" class="kr-gchip" data-filter="omics" aria-pressed="false">Omics</button>
    <button type="button" class="kr-gchip" data-filter="field" aria-pressed="false">Field and climate</button>
  </div>

  <!-- Masonry wall of figures -->
  <div class="kr-wall">
    {% for fig in figs %}
      <div class="kr-wall-item" id="fig-{{ fig.id }}" data-tags="{{ fig.tags | join: ' ' }}">
        {% include kr-fig-card.liquid fig=fig %}
      </div>
    {% endfor %}
  </div>

  <p class="kr-gallery-note">All papers shown here are open access. Each figure is reproduced unchanged with credit to the original article and under its licence, shown in the viewer.</p>
</div>

## Field and lab photos

<div class="row">
  <div class="col-sm-6 col-md-4 mt-3">
    {% include figure.liquid path="assets/img/1.jpg" title="Field research placeholder" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 col-md-4 mt-3">
    {% include figure.liquid path="assets/img/lab-uplc.jpg" title="Loading samples for UPLC metabolomics" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 col-md-4 mt-3">
    {% include figure.liquid path="assets/img/Logo.jpg" title="Plant physiology placeholder" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 col-md-4 mt-3">
    {% include figure.liquid path="assets/img/4.jpg" title="Grapevine research placeholder" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 col-md-4 mt-3">
    {% include figure.liquid path="assets/img/5.jpg" title="Data and modeling placeholder" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 col-md-4 mt-3">
    {% include figure.liquid path="assets/img/6.jpg" title="Conference and collaboration placeholder" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

Photo captions and final research images can be replaced here as field, lab, and conference images are selected.
