---
layout: page
title: Breeding Panel Analysis
description: An open Shiny tool that takes a germplasm or breeding panel from VCF and passport files to population structure, multi-environment trials, AMMI and GGE biplots, genome scans and genomic prediction.
img: assets/img/breeding-panel/card.jpg
importance: 1
category: Software
permalink: /resources/software/breeding-panel-analysis/
---

<!--
  Before publishing:
  1. Replace APP_URL below with the address Connect Cloud gives you.
  2. Replace REPO_URL with your GitHub repository address.
  Both appear more than once, so use find and replace.
-->

{% assign app_url = "https://kidane-breedappl.share.connect.posit.cloud" %}
{% assign repo_url = "https://github.com/reKidane/BreedApPl" %}

<div class="row justify-content-center mt-3 mb-4">
  <div class="col-auto">
    <a class="btn btn-primary" href="{{ app_url }}" target="_blank" rel="noopener">Open the live app</a>
    <a class="btn btn-outline-secondary" href="{{ repo_url }}" target="_blank" rel="noopener">Source on GitHub</a>
  </div>
</div>

Most breeding panels arrive as three files: genotypes, a passport table and a
sheet of trial records. Getting from those to a decision, which lines to
advance and which sites to keep testing at, means population structure,
multi-environment trial analysis, biplots, a genome scan and a prediction
check, each usually done in a different script by a different person.

This is that whole path in one application, running on a simulated barley
germplasm panel you can replace with your own data.

<div class="ratio ratio-16x9 my-4 border rounded" style="min-height: 620px;">
  <iframe src="{{ app_url }}" title="Breeding Panel Analysis" loading="lazy"
          allowfullscreen style="border:0;"></iframe>
</div>

<div class="caption">
  The application, running live. If the frame above stays blank, the host does
  not permit embedding: <a href="{{ app_url }}" target="_blank" rel="noopener">open it in a new tab</a> instead.
</div>

<div class="row mt-4">
  <div class="col-sm mt-3 mt-md-0">
    <img src="{{ 'assets/img/breeding-panel/overview.jpg' | relative_url }}" class="img-fluid rounded z-depth-1" alt="The Overview tab, describing the panel and the headline findings in that panel's own numbers">
  </div>
</div>
<div class="caption">
  The Overview tab. Every sentence on it is computed from the run on screen
  rather than stored, so a different dataset is described in its own numbers,
  including when the honest answer is that an effect is absent.
</div>

## What it answers

<div class="row">
  <div class="col-sm-6">
    <ul>
      <li><strong>Does the genomic structure match the recorded groups?</strong> Principal components, gene diversity per group, pairwise differentiation, and a batch check that says whether apparent structure is technical.</li>
      <li><strong>Which groups actually differ, and by how much?</strong> Trait distributions with a compact letter display, the test and the error rate chosen by you, and every pairwise comparison with its adjusted p value.</li>
      <li><strong>How much genotype-by-site interaction is there?</strong> Variance components, heritability across sites and years, Finlay-Wilkinson stability, and performance by group, site and year.</li>
    </ul>
  </div>
  <div class="col-sm-6">
    <ul>
      <li><strong>What shape does that interaction have?</strong> AMMI and GGE by singular value decomposition, interaction axes tested against the within-plot error, a which-won-where polygon, and mega-environments delineated two independent ways.</li>
      <li><strong>Is any marker associated with a trait?</strong> Association and differentiation scans with a threshold you move, and a marker table that follows it.</li>
      <li><strong>Would genomic prediction work here?</strong> Accuracy under random and leave-one-group-out validation, which are not the same question.</li>
    </ul>
  </div>
</div>

<div class="row mt-4">
  <div class="col-sm mt-3 mt-md-0">
    <img src="{{ 'assets/img/breeding-panel/sites.jpg' | relative_url }}" class="img-fluid rounded z-depth-1" alt="The Sites tab: variance components, stability and the genotype by site interaction plot">
  </div>
  <div class="col-sm mt-3 mt-md-0">
    <img src="{{ 'assets/img/breeding-panel/biplots.jpg' | relative_url }}" class="img-fluid rounded z-depth-1" alt="The Biplots tab: AMMI, GGE which-won-where and the mega-environment map">
  </div>
</div>
<div class="caption">
  Left, where the variation sits and which lines cross between sites. Right,
  the two decompositions of the same table: AMMI measures the interaction, GGE
  says which line wins where.
</div>

## Two panel designs, detected rather than assumed

The pipeline reads which kind of panel it has been given from the class labels
in the passport, and changes the analysis accordingly.

|                 | Divergent selection                                      | Germplasm panel                                                |
| --------------- | -------------------------------------------------------- | -------------------------------------------------------------- |
| Recognised when | the labels carry both an upward and a downward direction | they do not                                                    |
| Gradient        | signed selection index                                   | position in the ordered filial series                          |
| Contrasts       | high against low, and each cycle against the base        | each class against a reference, and the two ends of the series |
| A trend means   | correlated response to selection                         | inbreeding depression, where dominance exists                  |

Groups with no position on an ordered axis, elite lines, landraces, wild
relatives, are compared as classes rather than given an invented place on a
line.

## Bring your own data

Three files: a passport table, a VCF, and phenotypes as plot records or as one
fitted value per genotype. Twenty-two input checks run first, each reporting
pass, warning or error with a sentence naming the fix, and the run button stays
disabled until nothing is failing. Ploidy, the number of sites, years and
replicates, and the trait list are all read from the data rather than assumed.

The application can also generate a complete template dataset from a function
with every one of those parameters exposed, so you can see how the analysis
behaves on a design close to yours before committing your own files.

<div class="row mt-4">
  <div class="col-sm mt-3 mt-md-0">
    <img src="{{ 'assets/img/breeding-panel/figures.jpg' | relative_url }}" class="img-fluid rounded z-depth-1" alt="The Figures tab: every figure the run produced, with captions and downloads">
  </div>
</div>
<div class="caption">
  Every run produces 38 publication-ready figures at 300 dpi, all of them in
  the app with a caption and a download, and all of them redrawn from your data
  rather than stored.
</div>

## How it is checked

A simulator with a recorded truth generates the template panel, and 35 checks
score the pipeline's estimates against what the simulation actually did: that
heterozygosity halves with each generation of selfing, that BLUPs recover the
true genetic values, that inbreeding depression appears only where dominance
was simulated, that differentiation is elevated at the domestication genes and
not at the polygenic background, that AMMI concentrates a simulated crossover
on one axis and gives no dominant axis to unstructured interaction, and that
both mega-environment methods recover the simulated split.

That is a question real data cannot answer, which is the point of simulating
it. Every check currently passes.

<div class="row justify-content-center mt-4">
  <div class="col-auto">
    <a class="btn btn-primary" href="{{ app_url }}" target="_blank" rel="noopener">Open the live app</a>
    <a class="btn btn-outline-secondary" href="{{ repo_url }}" target="_blank" rel="noopener">Source on GitHub</a>
  </div>
</div>

<div class="caption mt-3">
  Written in R. Statistical routines, AMMI and GGE by singular value
  decomposition, Weir-Cockerham Fst, the compact letter display, Finlay-Wilkinson
  regression, are implemented directly rather than called from a package, so
  every number can be traced to its definition. Published on Posit Connect Cloud
  and released under the MIT licence.
</div>
