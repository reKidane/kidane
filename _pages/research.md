---
layout: page
permalink: /research/
title: Research
description: Research program in crop stress physiology, plant metabolism, multi-omics integration, and predictive modeling.
nav: true
nav_order: 2
---

## Research Vision

My research examines how crops respond to complex abiotic stress from the cellular scale to whole-plant and field performance. I integrate physiology, metabolomics, ionomics, transcriptomics, phenomics, root-shoot traits, and computational modeling to identify mechanisms, thresholds, and predictive signatures of resilience.

## Major Themes

<div class="kr-explorer" id="research-explorer">
  <figure class="kr-scales" aria-hidden="true">
    <svg viewBox="0 0 960 240" role="img" focusable="false">
      <!-- scale dividers and labels -->
      <g class="kr-scale-grid">
        <line x1="240" y1="36" x2="240" y2="232" />
        <line x1="480" y1="36" x2="480" y2="232" />
        <line x1="720" y1="36" x2="720" y2="232" />
      </g>
      <!-- Cell: metabolic network inside a leaf cell -->
      <g class="kr-zone" data-zone="cell">
        <text class="kr-zone-label" x="120" y="24">Cell</text>
        <ellipse class="kr-cell-wall" cx="120" cy="128" rx="92" ry="74" />
        <circle class="kr-nucleus" cx="156" cy="104" r="20" />
        <ellipse class="kr-chloroplast" cx="70" cy="156" rx="17" ry="8" transform="rotate(-20 70 156)" />
        <ellipse class="kr-chloroplast" cx="92" cy="84" rx="15" ry="7" transform="rotate(18 92 84)" />
        <ellipse class="kr-chloroplast" cx="164" cy="166" rx="16" ry="7" transform="rotate(12 164 166)" />
        <g class="kr-network">
          <line x1="66" y1="116" x2="96" y2="132" />
          <line x1="96" y1="132" x2="124" y2="110" />
          <line x1="124" y1="110" x2="98" y2="100" />
          <line x1="96" y1="132" x2="120" y2="152" />
          <line x1="120" y1="152" x2="146" y2="140" />
          <line x1="124" y1="110" x2="146" y2="140" />
          <line x1="66" y1="116" x2="98" y2="100" />
          <circle cx="66" cy="116" r="4" />
          <circle cx="96" cy="132" r="4.5" />
          <circle cx="124" cy="110" r="4" />
          <circle cx="98" cy="100" r="3.5" />
          <circle cx="120" cy="152" r="4" />
          <circle cx="146" cy="140" r="3.5" />
        </g>
      </g>
      <!-- Plant: grafted vine, scion above and rootstock below the soil line -->
      <g class="kr-zone" data-zone="plant">
        <text class="kr-zone-label" x="360" y="24">Plant</text>
        <rect class="kr-soil" x="242" y="176" width="236" height="62" rx="4" />
        <g class="kr-roots">
          <path d="M360 176 C 356 196, 338 206, 318 228" />
          <path d="M360 176 C 366 198, 386 208, 404 230" />
          <path d="M360 176 L 361 234" />
          <path d="M339 205 C 330 207, 322 204, 312 206" />
          <path d="M383 206 C 392 209, 400 206, 410 210" />
          <path d="M361 214 C 368 218, 374 218, 380 224" />
        </g>
        <path class="kr-trunk" d="M360 176 L 360 100" />
        <ellipse class="kr-graft" cx="360" cy="162" rx="6" ry="4" />
        <line class="kr-wire" x1="288" y1="100" x2="432" y2="100" />
        <path class="kr-cordon" d="M300 100 Q 360 90 420 100" />
        <g class="kr-leaves">
          <circle cx="306" cy="84" r="15" />
          <circle cx="334" cy="72" r="16" />
          <circle cx="362" cy="64" r="17" />
          <circle cx="390" cy="72" r="16" />
          <circle cx="416" cy="84" r="15" />
        </g>
        <g class="kr-berries">
          <circle cx="342" cy="110" r="4.2" />
          <circle cx="351" cy="110" r="4.2" />
          <circle cx="337" cy="118" r="4.2" />
          <circle cx="346" cy="118" r="4.2" />
          <circle cx="355" cy="118" r="4.2" />
          <circle cx="342" cy="126" r="4.2" />
          <circle cx="351" cy="126" r="4.2" />
          <circle cx="346" cy="134" r="4.2" />
        </g>
      </g>
      <!-- Vineyard: rows under a UAV thermal scan -->
      <g class="kr-zone" data-zone="vineyard">
        <text class="kr-zone-label" x="600" y="24">Vineyard</text>
        <rect class="kr-soil" x="482" y="176" width="236" height="62" rx="4" />
        <polygon class="kr-scan" points="596,64 604,64 690,170 510,170" />
        <g class="kr-drone">
          <rect x="588" y="52" width="24" height="9" rx="3" />
          <line x1="588" y1="54" x2="572" y2="48" />
          <line x1="612" y1="54" x2="628" y2="48" />
          <ellipse cx="568" cy="47" rx="11" ry="2.6" />
          <ellipse cx="632" cy="47" rx="11" ry="2.6" />
        </g>
        <g class="kr-rows">
          <line class="kr-wire" x1="522" y1="128" x2="678" y2="128" />
          <line class="kr-wire" x1="508" y1="150" x2="692" y2="150" />
          <line class="kr-wire" x1="494" y1="174" x2="706" y2="174" />
        </g>
        <g class="kr-leaves">
          <circle cx="532" cy="123" r="6" />
          <circle cx="558" cy="123" r="6" />
          <circle cx="584" cy="123" r="6" />
          <circle cx="610" cy="123" r="6" />
          <circle cx="636" cy="123" r="6" />
          <circle cx="662" cy="123" r="6" />
          <circle cx="518" cy="143" r="8" />
          <circle cx="551" cy="143" r="8" />
          <circle cx="584" cy="143" r="8" />
          <circle cx="617" cy="143" r="8" />
          <circle cx="650" cy="143" r="8" />
          <circle cx="683" cy="143" r="8" />
          <circle cx="506" cy="165" r="10" />
          <circle cx="546" cy="165" r="10" />
          <circle cx="586" cy="165" r="10" />
          <circle cx="626" cy="165" r="10" />
          <circle cx="666" cy="165" r="10" />
          <circle cx="702" cy="165" r="9" />
        </g>
      </g>
      <!-- Climate: warming trend with a heatwave spike and a projection -->
      <g class="kr-zone" data-zone="climate">
        <text class="kr-zone-label" x="840" y="24">Climate</text>
        <g class="kr-sun">
          <circle cx="792" cy="78" r="20" />
          <line x1="792" y1="46" x2="792" y2="38" />
          <line x1="792" y1="110" x2="792" y2="118" />
          <line x1="760" y1="78" x2="752" y2="78" />
          <line x1="824" y1="78" x2="832" y2="78" />
          <line x1="769" y1="55" x2="764" y2="50" />
          <line x1="815" y1="101" x2="820" y2="106" />
          <line x1="815" y1="55" x2="820" y2="50" />
          <line x1="769" y1="101" x2="764" y2="106" />
        </g>
        <g class="kr-axes">
          <line x1="752" y1="214" x2="938" y2="214" />
          <line x1="752" y1="214" x2="752" y2="136" />
        </g>
        <polyline class="kr-trend" points="758,204 782,200 806,203 830,192 852,186 868,160 878,190 900,174 918,166" />
        <polyline class="kr-trend kr-projection" points="918,166 936,148" />
      </g>
    </svg>
  </figure>
  <div class="kr-explorer-tabs" role="tablist" aria-label="Research themes, from cell to climate">
    <button type="button" role="tab" id="rt-tab-omics" aria-controls="rt-omics" data-zones="cell">
      <span class="kr-tab-scale">Cell</span>
      <span class="kr-tab-title">Metabolomics and multi-omics</span>
    </button>
    <button type="button" role="tab" id="rt-tab-thresholds" aria-controls="rt-thresholds" data-zones="cell plant">
      <span class="kr-tab-scale">Cell to plant</span>
      <span class="kr-tab-title">Thresholds and networks</span>
    </button>
    <button type="button" role="tab" id="rt-tab-rootstock" aria-controls="rt-rootstock" data-zones="plant">
      <span class="kr-tab-scale">Plant</span>
      <span class="kr-tab-title">Rootstock-mediated resilience</span>
    </button>
    <button type="button" role="tab" id="rt-tab-combined" aria-controls="rt-combined" data-zones="plant vineyard">
      <span class="kr-tab-scale">Plant to vineyard</span>
      <span class="kr-tab-title">Combined stress in grapevine</span>
    </button>
    <button type="button" role="tab" id="rt-tab-climate" aria-controls="rt-climate" data-zones="vineyard climate">
      <span class="kr-tab-scale">Vineyard to climate</span>
      <span class="kr-tab-title">Climate-informed prediction</span>
    </button>
  </div>
  <div class="kr-explorer-panels">
    <section class="kr-panel" role="tabpanel" id="rt-omics" aria-labelledby="rt-tab-omics" data-zones="cell">
      <h3>Plant Metabolomics And Multi-Omics Integration</h3>
      <p>My work uses GC-MS, LC-MS, HS-SPME-GC-MS, ICP-OES, and transcriptomic integration to identify biochemical signatures of stress response. I am especially interested in central carbon metabolism, specialized metabolism, ion partitioning, and pathway-level regulation under combined stress.</p>
      <p class="kr-panel-related">
        <span>Related</span>
        <a href="https://doi.org/10.1016/j.stress.2025.100864" target="_blank" rel="noopener">Syrah crosses a distinct salinity tipping point before entering a stress-response mode</a>
        <a href="{{ '/projects/2_project/' | relative_url }}">Rootstock project</a>
      </p>
    </section>
    <section class="kr-panel" role="tabpanel" id="rt-thresholds" aria-labelledby="rt-tab-thresholds" data-zones="cell plant">
      <h3>Thresholds, Tipping Points, And Network Analysis</h3>
      <p>A recurring goal is to define when plants shift from acclimation to stress-response modes. I use physiology, metabolomics, ionomics, phenology, agronomic data, network inference, and machine learning to identify trait breakpoints and regulatory nodes.</p>
      <p class="kr-panel-related">
        <span>Related</span>
        <a href="https://doi.org/10.1016/j.stress.2026.101456" target="_blank" rel="noopener">Metabolic network homeostasis drives rootstock-mediated tolerance to combined stress</a>
        <a href="{{ '/projects/2_project/' | relative_url }}">Rootstock project</a>
      </p>
    </section>
    <section class="kr-panel" role="tabpanel" id="rt-rootstock" aria-labelledby="rt-tab-rootstock" data-zones="plant">
      <h3>Rootstock-Mediated Stress Resilience</h3>
      <p>I study how belowground traits influence scion physiology and whole-plant performance. Key questions include how root system architecture, ion selectivity, and root-shoot signaling shape stress acclimation and yield stability.</p>
      <p class="kr-panel-related">
        <span>Related</span>
        <a href="https://doi.org/10.1016/j.stress.2026.101456" target="_blank" rel="noopener">Metabolic network homeostasis drives rootstock-mediated tolerance to combined stress</a>
        <a href="{{ '/projects/2_project/' | relative_url }}">Rootstock project</a>
      </p>
    </section>
    <section class="kr-panel" role="tabpanel" id="rt-combined" aria-labelledby="rt-tab-combined" data-zones="plant vineyard">
      <h3>Combined Abiotic Stress In Grapevine</h3>
      <p>My PhD research focused on <em>Vitis vinifera</em> grafts exposed to combined salinity, water deficit, and heat-related stress. The work links rootstock variation with ion regulation, photosynthesis, water status, metabolism, phenology, and agronomic performance.</p>
      <p class="kr-panel-related">
        <span>Related</span>
        <a href="https://doi.org/10.1016/j.stress.2025.101050" target="_blank" rel="noopener">Rootstock choice modulates Syrah phenology and yield across three field seasons</a>
        <a href="{{ '/projects/2_project/' | relative_url }}">Rootstock project</a>
      </p>
    </section>
    <section class="kr-panel" role="tabpanel" id="rt-climate" aria-labelledby="rt-tab-climate" data-zones="vineyard climate">
      <h3>Climate-Informed Predictive Modeling</h3>
      <p>Current postdoctoral work integrates multi-year physiological phenotyping, UAV-based thermal sensing, metabolomics, gene expression, and climate data to predict varietal performance under heatwave stress and future climate scenarios.</p>
      <p class="kr-panel-related">
        <span>Related</span>
        <a href="https://doi.org/10.21203/rs.3.rs-10256443/v1" target="_blank" rel="noopener">Integrative phenotyping reveals a varietal signature of heatwave response</a>
        <a href="{{ '/projects/1_project/' | relative_url }}">OIV heatwave project</a>
      </p>
    </section>
  </div>
  <div class="kr-explorer-steps">
    <button type="button" class="kr-step" data-step="-1" aria-label="Previous theme"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i> Smaller scale</button>
    <span class="kr-step-count" aria-live="polite"></span>
    <button type="button" class="kr-step" data-step="1" aria-label="Next theme">Larger scale <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
  </div>
</div>

## Crop Systems

- Grapevine, especially _Vitis vinifera_ cv. Syrah and varietal collections under arid and warm viticulture.
- Sorghum and other dryland cereals, including work on breeding, multi-environment trials, and stress adaptation.
- Maize, barley, wheat, beans, and haricot bean systems through prior agronomy, seed quality, and crop improvement work.
