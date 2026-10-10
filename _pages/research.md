---
layout: page
permalink: /research/
title: Research
description: Research program in crop stress physiology, plant metabolism, multi-omics integration, crop improvement, and predictive modeling.
nav: true
nav_order: 2
---

## Research Vision

My research examines how crops respond to complex abiotic stress from the cellular scale to whole-plant and field performance. I integrate physiology, metabolomics, ionomics, transcriptomics, phenomics, root-shoot traits, and computational modeling to identify mechanisms, thresholds, and predictive signatures of resilience.

## Major Themes

<div class="kr-explorer" id="research-explorer">
  <figure class="kr-scales" aria-hidden="true">
    <svg viewBox="0 0 1200 240" role="img" focusable="false">
      <g class="kr-scale-grid">
        <line x1="240" y1="36" x2="240" y2="232" />
        <line x1="480" y1="36" x2="480" y2="232" />
        <line x1="720" y1="36" x2="720" y2="232" />
        <line x1="960" y1="36" x2="960" y2="232" />
      </g>
      <!-- Cell: the omics layers inside one leaf cell -->
      <g class="kr-zone" data-zone="cell">
        <text class="kr-zone-label" x="120" y="24">Cell</text>
        <ellipse class="kr-cell-wall" cx="120" cy="132" rx="100" ry="80" />
        <ellipse class="kr-chloroplast" cx="180" cy="160" rx="16" ry="7" transform="rotate(12 180 160)" />
        <ellipse class="kr-chloroplast" cx="134" cy="194" rx="15" ry="7" transform="rotate(-8 134 194)" />
        <circle class="kr-nucleus" cx="150" cy="106" r="30" />
        <g class="kr-omic-el kr-dna" data-omic="genomics">
          <path d="M130 108 Q 140 94 150 108 T 170 108" />
          <path d="M130 108 Q 140 122 150 108 T 170 108" />
          <line x1="135" y1="103" x2="135" y2="113" />
          <line x1="145" y1="103" x2="145" y2="113" />
          <line x1="155" y1="103" x2="155" y2="113" />
          <line x1="165" y1="103" x2="165" y2="113" />
        </g>
        <g class="kr-omic-el kr-mrna" data-omic="transcriptomics">
          <path d="M121 100 C 110 92, 104 104, 94 96 S 80 88, 72 96" />
          <line x1="104" y1="97" x2="104" y2="91" />
          <line x1="94" y1="96" x2="94" y2="90" />
          <line x1="84" y1="92" x2="84" y2="86" />
        </g>
        <g class="kr-omic-el kr-network" data-omic="metabolomics">
          <line x1="86" y1="146" x2="112" y2="138" />
          <line x1="112" y1="138" x2="132" y2="158" />
          <line x1="86" y1="146" x2="104" y2="168" />
          <line x1="104" y1="168" x2="132" y2="158" />
          <line x1="104" y1="168" x2="90" y2="188" />
          <line x1="112" y1="138" x2="104" y2="168" />
          <circle cx="86" cy="146" r="4.5" />
          <circle cx="112" cy="138" r="4" />
          <circle cx="132" cy="158" r="4" />
          <circle cx="104" cy="168" r="5" />
          <circle cx="90" cy="188" r="3.5" />
        </g>
        <g class="kr-omic-el kr-ions" data-omic="ionomics">
          <circle cx="44" cy="118" r="10" /><text x="44" y="121.5">Na⁺</text>
          <circle cx="40" cy="146" r="10" /><text x="40" y="149.5">K⁺</text>
          <circle cx="54" cy="174" r="10" /><text x="54" y="177.5">Cl⁻</text>
        </g>
      </g>
      <!-- Plant: grafted vine, imaged for phenomics -->
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
        <g class="kr-omic-el kr-camera" data-omic="phenomics">
          <path d="M286 52 L 286 42 L 296 42" />
          <path d="M434 52 L 434 42 L 424 42" />
          <path d="M286 140 L 286 150 L 296 150" />
          <path d="M434 140 L 434 150 L 424 150" />
          <rect x="444" y="40" width="26" height="18" rx="4" />
          <circle cx="457" cy="49" r="5" />
        </g>
      </g>
      <!-- Vineyard: rows under a UAV thermal scan -->
      <g class="kr-zone" data-zone="vineyard">
        <text class="kr-zone-label" x="600" y="24">Vineyard</text>
        <rect class="kr-soil" x="482" y="176" width="236" height="62" rx="4" />
        <polygon class="kr-scan" points="596,64 604,64 690,170 510,170" />
        <g class="kr-omic-el kr-drone" data-omic="phenomics">
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
      <!-- Breeding trials: genotyped lines tested across environments -->
      <g class="kr-zone" data-zone="trials">
        <text class="kr-zone-label" x="840" y="24">Breeding trials</text>
        <g class="kr-omic-el kr-chromosome" data-omic="genomics">
          <rect x="764" y="38" width="152" height="10" rx="6" />
          <line x1="782" y1="35" x2="782" y2="51" />
          <line x1="801" y1="35" x2="801" y2="51" />
          <line x1="829" y1="35" x2="829" y2="51" />
          <line x1="846" y1="35" x2="846" y2="51" />
          <line x1="874" y1="35" x2="874" y2="51" />
          <line x1="898" y1="35" x2="898" y2="51" />
        </g>
        <rect class="kr-soil" x="722" y="176" width="236" height="62" rx="4" />
        <g class="kr-plot">
          <rect class="kr-plot-bed" x="746" y="168" width="62" height="12" rx="3" />
          <line class="kr-stalk" x1="755" y1="170" x2="755" y2="98" /><ellipse class="kr-panicle" cx="755" cy="90" rx="4.5" ry="8" />
          <line class="kr-stalk" x1="770" y1="170" x2="770" y2="84" /><ellipse class="kr-panicle" cx="770" cy="76" rx="4.5" ry="8" />
          <line class="kr-stalk" x1="785" y1="170" x2="785" y2="92" /><ellipse class="kr-panicle" cx="785" cy="84" rx="4.5" ry="8" />
          <line class="kr-stalk" x1="800" y1="170" x2="800" y2="80" /><ellipse class="kr-panicle" cx="800" cy="72" rx="4.5" ry="8" />
          <text class="kr-env" x="777" y="200">E1</text>
        </g>
        <g class="kr-plot">
          <rect class="kr-plot-bed" x="818" y="168" width="62" height="12" rx="3" />
          <line class="kr-stalk" x1="827" y1="170" x2="827" y2="88" /><ellipse class="kr-panicle" cx="827" cy="80" rx="4.5" ry="8" />
          <line class="kr-stalk" x1="842" y1="170" x2="842" y2="100" /><ellipse class="kr-panicle" cx="842" cy="92" rx="4.5" ry="8" />
          <line class="kr-stalk" x1="857" y1="170" x2="857" y2="82" /><ellipse class="kr-panicle" cx="857" cy="74" rx="4.5" ry="8" />
          <line class="kr-stalk" x1="872" y1="170" x2="872" y2="94" /><ellipse class="kr-panicle" cx="872" cy="86" rx="4.5" ry="8" />
          <text class="kr-env" x="849" y="200">E2</text>
        </g>
        <g class="kr-plot">
          <rect class="kr-plot-bed" x="890" y="168" width="62" height="12" rx="3" />
          <line class="kr-stalk" x1="899" y1="170" x2="899" y2="102" /><ellipse class="kr-panicle" cx="899" cy="94" rx="4.5" ry="8" />
          <line class="kr-stalk" x1="914" y1="170" x2="914" y2="90" /><ellipse class="kr-panicle" cx="914" cy="82" rx="4.5" ry="8" />
          <line class="kr-stalk" x1="929" y1="170" x2="929" y2="98" /><ellipse class="kr-panicle" cx="929" cy="90" rx="4.5" ry="8" />
          <line class="kr-stalk" x1="944" y1="170" x2="944" y2="86" /><ellipse class="kr-panicle" cx="944" cy="78" rx="4.5" ry="8" />
          <text class="kr-env" x="921" y="200">E3</text>
        </g>
      </g>
      <!-- Climate: warming trend with a heatwave spike and a projection -->
      <g class="kr-zone" data-zone="climate">
        <text class="kr-zone-label" x="1080" y="24">Climate</text>
        <g class="kr-sun">
          <circle cx="1032" cy="78" r="20" />
          <line x1="1032" y1="46" x2="1032" y2="38" />
          <line x1="1032" y1="110" x2="1032" y2="118" />
          <line x1="1000" y1="78" x2="992" y2="78" />
          <line x1="1064" y1="78" x2="1072" y2="78" />
          <line x1="1009" y1="55" x2="1004" y2="50" />
          <line x1="1055" y1="101" x2="1060" y2="106" />
          <line x1="1055" y1="55" x2="1060" y2="50" />
          <line x1="1009" y1="101" x2="1004" y2="106" />
        </g>
        <g class="kr-axes">
          <line x1="992" y1="214" x2="1178" y2="214" />
          <line x1="992" y1="214" x2="992" y2="136" />
        </g>
        <polyline class="kr-trend" points="998,204 1022,200 1046,203 1070,192 1092,186 1108,160 1118,190 1140,174 1158,166" />
        <polyline class="kr-trend kr-projection" points="1158,166 1176,148" />
      </g>
    </svg>
  </figure>
  <div class="kr-explorer-tabs" role="tablist" aria-label="Research themes, from cell to climate">
    <button type="button" role="tab" id="rt-tab-omics" aria-controls="rt-omics" data-zones="cell">
      <span class="kr-tab-scale">Cell</span>
      <span class="kr-tab-title">Multi-omics of stress</span>
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
    <button type="button" role="tab" id="rt-tab-breeding" aria-controls="rt-breeding" data-zones="cell trials">
      <span class="kr-tab-scale">Genome to field trials</span>
      <span class="kr-tab-title">Crop improvement by breeding</span>
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
      <p>Each omics layer answers a different question about the same stressed tissue, so the layers are measured on the same plants and read together. Point at a layer to find it in the drawing.</p>
      <ul class="kr-omics">
        <li tabindex="0" data-omic="genomics"><strong>Genomics</strong><span>Which genetic variants underlie a trait. GBS and SNP genotyping, QTL mapping, GWAS, and marker-assisted selection.</span></li>
        <li tabindex="0" data-omic="transcriptomics"><strong>Transcriptomics</strong><span>Which genes are switched on or off under stress. Gene expression profiling integrated with metabolite and ion data.</span></li>
        <li tabindex="0" data-omic="metabolomics"><strong>Metabolomics</strong><span>How carbon is rerouted. GC-MS and LC-MS profiling of central carbon and specialized metabolism, and HS-SPME-GC-MS for volatiles.</span></li>
        <li tabindex="0" data-omic="ionomics"><strong>Ionomics</strong><span>Where sodium, chloride and potassium accumulate. ICP-OES ion profiling of roots, leaves and berries.</span></li>
        <li tabindex="0" data-omic="phenomics"><strong>Phenomics</strong><span>What the whole plant does. Gas exchange, chlorophyll fluorescence, root and shoot phenotyping, and UAV thermal imaging.</span></li>
      </ul>
      <div class="kr-panel-related">
        <p class="kr-related-title">Related papers</p>
        <ul>
          <li><a href="https://doi.org/10.1016/j.stress.2025.100864" target="_blank" rel="noopener">Integrated metabolomics and ionomics reveal a distinct salinity tipping point in Syrah</a> <span>Plant Stress, 2025</span></li>
          <li><a href="https://doi.org/10.1016/j.stress.2026.101456" target="_blank" rel="noopener">Metabolic network homeostasis drives rootstock-mediated tolerance to combined stress</a> <span>Plant Stress, 2026</span></li>
          <li><a href="https://doi.org/10.21203/rs.3.rs-10256443/v1" target="_blank" rel="noopener">Multiscale phenomics reveals a varietal signature of grapevine response to heatwaves</a> <span>Preprint, under review</span></li>
        </ul>
        <p class="kr-related-projects"><a href="{{ '/projects/2_project/' | relative_url }}">Rootstock project</a> <a href="{{ '/projects/1_project/' | relative_url }}">OIV heatwave project</a></p>
      </div>
    </section>
    <section class="kr-panel" role="tabpanel" id="rt-thresholds" aria-labelledby="rt-tab-thresholds" data-zones="cell plant">
      <h3>Thresholds, Tipping Points, And Network Analysis</h3>
      <p>A recurring goal is to define when plants shift from acclimation to stress-response modes. I use physiology, metabolomics, ionomics, phenology, agronomic data, network inference, and machine learning to identify trait breakpoints and regulatory nodes.</p>
      <p>In practice, the same plants are followed across omics layers and through time as stress increases. Ion accumulation, shifts in central and specialized metabolites, gene expression, photosynthesis and water status are linked through correlation networks. Breakpoint analysis along the stress gradient marks where coordinated regulation gives way to a stress-response mode, and machine learning identifies which traits carry that signal across rootstocks and seasons.</p>
      <ol class="kr-chain" aria-label="From cell signal to plant performance">
        <li>Ion uptake and partitioning</li>
        <li>Metabolic and transcript shifts</li>
        <li>Photosynthesis and water status</li>
        <li>Growth, phenology and yield</li>
      </ol>
      <div class="kr-panel-related">
        <p class="kr-related-title">Related papers</p>
        <ul>
          <li><a href="https://doi.org/10.1016/j.stress.2025.100864" target="_blank" rel="noopener">Syrah crosses a distinct salinity tipping point before entering a stress-response mode</a> <span>Plant Stress, 2025</span></li>
          <li><a href="https://doi.org/10.1016/j.stress.2026.101456" target="_blank" rel="noopener">Metabolic network homeostasis and an antagonistic stress response drive rootstock-mediated tolerance</a> <span>Plant Stress, 2026</span></li>
        </ul>
        <p class="kr-related-projects"><a href="{{ '/projects/2_project/' | relative_url }}">Rootstock project</a></p>
      </div>
    </section>
    <section class="kr-panel" role="tabpanel" id="rt-rootstock" aria-labelledby="rt-tab-rootstock" data-zones="plant">
      <h3>Rootstock-Mediated Stress Resilience</h3>
      <p>I study how belowground traits influence scion physiology and whole-plant performance. Key questions include how root system architecture, ion selectivity, and root-shoot signaling shape stress acclimation and yield stability.</p>
      <div class="kr-panel-related">
        <p class="kr-related-title">Related papers</p>
        <ul>
          <li><a href="https://doi.org/10.1016/j.stress.2026.101456" target="_blank" rel="noopener">Metabolic network homeostasis drives rootstock-mediated tolerance to combined stress</a> <span>Plant Stress, 2026</span></li>
          <li><a href="https://doi.org/10.1016/j.stress.2025.101050" target="_blank" rel="noopener">Rootstock choice modulates Syrah phenology and yield across three field seasons</a> <span>Plant Stress, 2025</span></li>
        </ul>
        <p class="kr-related-projects"><a href="{{ '/projects/2_project/' | relative_url }}">Rootstock project</a></p>
      </div>
    </section>
    <section class="kr-panel" role="tabpanel" id="rt-combined" aria-labelledby="rt-tab-combined" data-zones="plant vineyard">
      <h3>Combined Abiotic Stress In Grapevine</h3>
      <p>My PhD research focused on <em>Vitis vinifera</em> grafts exposed to combined salinity, water deficit, and heat-related stress. The work links rootstock variation with ion regulation, photosynthesis, water status, metabolism, phenology, and agronomic performance.</p>
      <div class="kr-panel-related">
        <p class="kr-related-title">Related papers</p>
        <ul>
          <li><a href="https://doi.org/10.1016/j.stress.2025.101050" target="_blank" rel="noopener">Rootstock choice modulates Syrah phenology and yield across three field seasons</a> <span>Plant Stress, 2025</span></li>
          <li><a href="https://doi.org/10.1016/j.stress.2025.100864" target="_blank" rel="noopener">Syrah crosses a distinct salinity tipping point before entering a stress-response mode</a> <span>Plant Stress, 2025</span></li>
          <li><a href="https://doi.org/10.1016/j.stress.2026.101456" target="_blank" rel="noopener">Metabolic network homeostasis drives rootstock-mediated tolerance to combined stress</a> <span>Plant Stress, 2026</span></li>
        </ul>
        <p class="kr-related-projects"><a href="{{ '/projects/2_project/' | relative_url }}">Rootstock project</a></p>
      </div>
    </section>
    <section class="kr-panel" role="tabpanel" id="rt-breeding" aria-labelledby="rt-tab-breeding" data-zones="cell trials">
      <h3>Crop Improvement Through Breeding</h3>
      <p>Before my PhD, I worked on sorghum improvement for dryland production systems in Ethiopia. The work combined crossing, hybridization, heterosis exploitation, large-scale field phenotyping, and multi-environment trial analysis, and contributed to the development and release of three improved sorghum varieties, with additional releases supported through team-based breeding.</p>
      <p>The research linked transpiration efficiency, root architecture, stress responses, agronomic performance, and genotype-by-environment interactions to identify stable, high-performing germplasm, using quantitative genetics, SNP-based genotyping, genotype-phenotype association analysis, and data-driven selection. Earlier agronomy, seed quality, and crop improvement work covered maize, wheat, barley, and haricot bean.</p>
      <ul class="kr-crops" aria-label="Crops">
        <li>Sorghum</li>
        <li>Maize</li>
        <li>Wheat</li>
        <li>Barley</li>
        <li>Haricot bean</li>
      </ul>
      <div class="kr-panel-related">
        <p class="kr-related-title">Related papers</p>
        <ul>
          <li><a href="https://doi.org/10.4236/ajps.2021.123027" target="_blank" rel="noopener">Spatial analysis separates stable sorghum genotypes and mega-environments for grain yield</a> <span>Am. J. Plant Sci., 2021</span></li>
          <li><a href="https://doi.org/10.11648/j.ajbio.20210905.13" target="_blank" rel="noopener">Agronomic traits reveal genetic variation among improved haricot bean varieties for half-diallel crossing</a> <span>Am. J. BioScience, 2021</span></li>
          <li><a href="https://doi.org/10.4236/AJPS.2020.1112151" target="_blank" rel="noopener">Sorghum hybrids show combining ability and heterosis for grain and biomass yield</a> <span>Am. J. Plant Sci., 2020</span></li>
          <li><a href="https://doi.org/10.4236/ajps.2020.1112136" target="_blank" rel="noopener">Genotype-by-environment analysis identifies sorghum genotypes for the Ethiopian highlands</a> <span>Am. J. Plant Sci., 2020</span></li>
          <li><a href="https://academicjournals.org/journal/JPBCS/article-references/E646F2C65057" target="_blank" rel="noopener">Multi-environment and spatial analysis identifies high-yielding sorghum hybrids for dry lowlands</a> <span>J. Plant Breed. Crop Sci., 2020</span></li>
          <li><a href="https://doi.org/10.4236/ajps.2020.1110117" target="_blank" rel="noopener">Spatial multi-environment analysis identifies advanced sorghum lines for moisture-stress areas</a> <span>Am. J. Plant Sci., 2020</span></li>
          <li><a href="https://doi.org/10.5897/ajar2019.14495" target="_blank" rel="noopener">Multi-environment and spatial analysis characterizes early-maturing sorghum for dry lowlands</a> <span>Afr. J. Agric. Res., 2020</span></li>
          <li><a href="https://doi.org/10.5897/AJPS2019.1813" target="_blank" rel="noopener">Gene action, combining ability and heterosis characterized in Ethiopian sorghum lines under moisture stress</a> <span>Afr. J. Plant Sci., 2020</span></li>
          <li><a href="https://academicresearchjournals.org/ARJASR/Abstract/2019/March/Kidanemaryam.htm" target="_blank" rel="noopener">Drought tolerance in sorghum rests on mechanisms that breeding methods can target</a> <span>Review, 2019</span></li>
        </ul>
        <p class="kr-related-projects"><a href="{{ '/projects/3_project/' | relative_url }}">Sorghum improvement project</a> <a href="{{ '/resources/software/breeding-panel-analysis/' | relative_url }}">Breeding Panel Analysis app</a></p>
      </div>
    </section>
    <section class="kr-panel" role="tabpanel" id="rt-climate" aria-labelledby="rt-tab-climate" data-zones="vineyard climate">
      <h3>Climate-Informed Predictive Modeling</h3>
      <p>Current postdoctoral work integrates multi-year physiological phenotyping, UAV-based thermal sensing, metabolomics, gene expression, and climate data to predict varietal performance under heatwave stress and future climate scenarios.</p>
      <div class="kr-panel-related">
        <p class="kr-related-title">Related papers</p>
        <ul>
          <li><a href="https://doi.org/10.21203/rs.3.rs-10256443/v1" target="_blank" rel="noopener">Multiscale phenomics reveals a varietal signature of grapevine response to heatwaves</a> <span>Preprint, under review</span></li>
          <li><a href="https://doi.org/10.1016/j.scienta.2025.113998" target="_blank" rel="noopener">Canopy management offers practical levers to sustain grape yield and quality in warming vineyards</a> <span>Sci. Hortic., 2025</span></li>
          <li><a href="https://doi.org/10.20870/oeno-one.2024.58.1.7148" target="_blank" rel="noopener">A Y-shaped training system improves Gewurztraminer berry and wine quality in an arid climate</a> <span>OENO One, 2024</span></li>
        </ul>
        <p class="kr-related-projects"><a href="{{ '/projects/1_project/' | relative_url }}">OIV heatwave project</a></p>
      </div>
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
